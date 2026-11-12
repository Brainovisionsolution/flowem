import crypto from 'crypto';
import { query } from '../../config/db.js';
import { emailProducer } from '../../queue/producers/emailProducer.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

export const campaignsService = {
  async getAllCampaigns() {
    const campaigns = await query(`
      SELECT c.*, cl.name as list_name, t.name as template_name
      FROM campaigns c
      LEFT JOIN contact_lists cl ON c.list_id = cl.id
      LEFT JOIN templates t ON c.template_id = t.id
      ORDER BY c.created_at DESC
    `);

    return campaigns.map(c => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      senderDomain: c.sender_email && c.sender_email.includes('@') ? c.sender_email.split('@')[1] : 'mail.brainovision.in',
      senderEmail: c.sender_email,
      senderName: c.sender_name,
      status: c.status,
      listName: c.list_name || 'General Audience',
      listId: c.list_id,
      templateId: c.template_id,
      templateTitle: c.template_name,
      recipientsTotal: c.recipients_total,
      sentCount: c.sent_count,
      deliveredCount: c.delivered_count,
      openedCount: c.opened_count,
      clickedCount: c.clicked_count,
      bouncedCount: c.bounced_count,
      deliveryRate: c.sent_count > 0 ? Number(((c.delivered_count / c.sent_count) * 100).toFixed(1)) : 0,
      openRate: c.delivered_count > 0 ? Number(((c.opened_count / c.delivered_count) * 100).toFixed(1)) : 0,
      clickRate: c.opened_count > 0 ? Number(((c.clicked_count / c.opened_count) * 100).toFixed(1)) : 0,
      scheduledAt: c.scheduled_at ? new Date(c.scheduled_at).toISOString() : null,
      createdAt: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  },

  async getCampaignById(id) {
    const rows = await query(`
      SELECT c.*, cl.name as list_name, t.name as template_name, t.html_content as template_html
      FROM campaigns c
      LEFT JOIN contact_lists cl ON c.list_id = cl.id
      LEFT JOIN templates t ON c.template_id = t.id
      WHERE c.id = ?
      LIMIT 1
    `, [id]);

    if (rows.length === 0) throw new NotFoundError('Campaign not found.');
    const campaign = rows[0];

    const recipients = await query(`
      SELECT * FROM campaign_recipients WHERE campaign_id = ? ORDER BY sent_at DESC LIMIT 100
    `, [id]);

    const events = await query(`
      SELECT * FROM campaign_events WHERE campaign_id = ? ORDER BY created_at DESC LIMIT 50
    `, [id]);

    return {
      ...campaign,
      recipients,
      events,
      deliveryRate: campaign.sent_count > 0 ? Number(((campaign.delivered_count / campaign.sent_count) * 100).toFixed(1)) : 0,
      openRate: campaign.delivered_count > 0 ? Number(((campaign.opened_count / campaign.delivered_count) * 100).toFixed(1)) : 0,
      clickRate: campaign.opened_count > 0 ? Number(((campaign.clicked_count / campaign.opened_count) * 100).toFixed(1)) : 0
    };
  },

  async createCampaign(data) {
    let templateId = data.templateId;
    if (!templateId) {
      const defaultTpls = await query('SELECT id FROM templates LIMIT 1');
      templateId = defaultTpls[0]?.id || null;
    }

    const initialStatus = data.sendImmediately ? 'Preparing' : (data.scheduledAt ? 'Scheduled' : 'Draft');
    const campaignId = crypto.randomUUID();

    await query(
      `INSERT INTO campaigns (
        id, name, subject, preview_text, sender_name, sender_email, reply_to_email,
        template_id, list_id, status, scheduled_at, recipients_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        campaignId,
        data.name || 'New Campaign',
        data.subject || 'Announcement from Brainovision',
        data.previewText || '',
        data.senderName || 'Brainovision Team',
        data.senderEmail || 'noreply@mail.brainovision.in',
        data.replyToEmail || 'support@brainovision.in',
        templateId,
        data.listId || null,
        initialStatus,
        data.scheduledAt ? new Date(data.scheduledAt) : null,
        data.recipientsTotal || 0
      ]
    );

    if (data.sendImmediately) {
      emailProducer.enqueueCampaignSend(campaignId).catch((err) => {
        console.error(`Failed to enqueue immediate campaign ${campaignId}:`, err.message);
      });
    }

    return {
      id: campaignId,
      name: data.name || 'New Campaign',
      subject: data.subject || 'Announcement from Brainovision',
      senderDomain: 'mail.brainovision.in',
      senderEmail: data.senderEmail || 'noreply@mail.brainovision.in',
      senderName: data.senderName || 'Brainovision Team',
      status: data.sendImmediately ? 'Sending' : initialStatus,
      listName: 'General Audience',
      recipientsTotal: data.recipientsTotal || 0,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
  },

  async updateStatus(id, newStatus) {
    const rows = await query('SELECT * FROM campaigns WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) throw new NotFoundError('Campaign not found.');
    const existing = rows[0];

    await query('UPDATE campaigns SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, id]);

    const eventId = crypto.randomUUID();
    await query(
      'INSERT INTO campaign_events (id, campaign_id, event_type, data_json) VALUES (?, ?, ?, ?)',
      [eventId, id, newStatus.toLowerCase(), JSON.stringify({ previousStatus: existing.status, updatedStatus: newStatus })]
    ).catch(() => {});

    if (newStatus === 'Sending' && existing.status !== 'Sending') {
      emailProducer.enqueueCampaignSend(id).catch(err => {
        console.error(`Error dispatching campaign ${id}:`, err.message);
      });
    }

    return {
      success: true,
      campaign: { ...existing, status: newStatus }
    };
  },

  async deleteCampaign(id) {
    await query('DELETE FROM campaign_recipients WHERE campaign_id = ?', [id]).catch(() => {});
    await query('DELETE FROM campaign_events WHERE campaign_id = ?', [id]).catch(() => {});
    await query('DELETE FROM campaigns WHERE id = ?', [id]);
    return { success: true, message: 'Campaign deleted.' };
  }
};
