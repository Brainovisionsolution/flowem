import crypto from 'crypto';
import { query } from '../../config/db.js';
import { queueService } from '../queue.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export const emailProducer = {
  /**
   * Loads recipients for a campaign, registers them in MySQL, and enqueues high-throughput delivery jobs
   */
  async enqueueCampaignSend(campaignId) {
    // 1. Idempotency protection to prevent duplicate sends
    const idempotencyKey = `campaign_send_${campaignId}`;
    const existingLock = await query('SELECT id FROM idempotency_records WHERE idempotency_key = ? LIMIT 1', [idempotencyKey]);

    if (existingLock.length > 0) {
      throw new BadRequestError('Campaign dispatch is already in progress or has been enqueued.');
    }

    const irId = crypto.randomUUID();
    await query(
      `INSERT INTO idempotency_records (id, idempotency_key, resource_type, resource_id) VALUES (?, ?, ?, ?)`,
      [irId, idempotencyKey, 'Campaign', campaignId]
    ).catch(() => {});

    // 2. Fetch campaign details with template and target list
    const campRows = await query('SELECT * FROM campaigns WHERE id = ? LIMIT 1', [campaignId]);
    if (campRows.length === 0) {
      throw new NotFoundError('Campaign not found.');
    }
    const campaign = campRows[0];

    const tplRows = await query('SELECT * FROM templates WHERE id = ? LIMIT 1', [campaign.template_id]);
    const template = tplRows[0];

    if (!template) {
      throw new BadRequestError('Campaign has no associated template.');
    }

    // 3. Resolve recipient contacts
    let targetContacts = [];
    if (campaign.list_id) {
      targetContacts = await query(`
        SELECT c.*
        FROM contacts c
        INNER JOIN contact_list_members clm ON c.id = clm.contact_id
        WHERE clm.list_id = ? AND c.status = 'Active'
      `, [campaign.list_id]);
    }

    if (!targetContacts || targetContacts.length === 0) {
      targetContacts = await query(`
        SELECT * FROM contacts WHERE status = 'Active' LIMIT 5000
      `);
    }

    if (targetContacts.length === 0) {
      throw new BadRequestError('No active recipients found for this campaign.');
    }

    // 4. Create or ensure CampaignRecipient records in MySQL
    const recipientRecords = [];
    for (const contact of targetContacts) {
      const recId = crypto.randomUUID();
      await query(
        `INSERT INTO campaign_recipients (id, campaign_id, contact_id, email, status)
         VALUES (?, ?, ?, ?, 'Queued')
         ON DUPLICATE KEY UPDATE status = 'Queued'`,
        [recId, campaign.id, contact.id, contact.email]
      );

      const resolvedRows = await query(
        'SELECT id, email FROM campaign_recipients WHERE campaign_id = ? AND email = ? LIMIT 1',
        [campaign.id, contact.email]
      );
      recipientRecords.push({ recipient: resolvedRows[0], contact });
    }

    // 5. Update campaign totals and mark status as Sending
    await query(
      `UPDATE campaigns SET status = 'Sending', started_at = NOW(), recipients_total = ? WHERE id = ?`,
      [recipientRecords.length, campaign.id]
    );

    // 6. Record CampaignEvent
    const ceId = crypto.randomUUID();
    await query(
      `INSERT INTO campaign_events (id, campaign_id, event_type, data_json) VALUES (?, ?, ?, ?)`,
      [ceId, campaign.id, 'started', JSON.stringify({ recipientCount: recipientRecords.length, enqueuedAt: new Date().toISOString() })]
    ).catch(() => {});

    // 7. Enqueue transmission jobs
    const jobs = recipientRecords.map(({ recipient, contact }) => ({
      name: `campaign-${campaign.id}-${recipient.id}`,
      data: {
        campaignId: campaign.id,
        recipientId: recipient.id,
        email: contact.email,
        firstName: contact.first_name || '',
        lastName: contact.last_name || '',
        subject: campaign.subject,
        templateHtml: template.html_content,
        fromEmail: campaign.sender_email,
        fromName: campaign.sender_name,
        replyTo: campaign.reply_to_email
      }
    }));

    await queueService.addBulkEmailJobs(jobs);

    return {
      success: true,
      campaignId: campaign.id,
      recipientsEnqueued: jobs.length,
      status: 'Sending'
    };
  },

  /**
   * Enqueues a single transactional email
   */
  async enqueueTransactionalEmail({ to, subject, html, variables = {}, fromName, fromEmail, replyTo }) {
    return queueService.addEmailJob('transactional-email', {
      email: to,
      firstName: variables.firstName || '',
      lastName: variables.lastName || '',
      subject,
      templateHtml: html,
      fromName,
      fromEmail,
      replyTo
    });
  }
};
