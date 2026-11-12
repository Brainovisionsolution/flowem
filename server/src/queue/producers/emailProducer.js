import { prisma } from '../../config/db.js';
import { queueService } from '../queue.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export const emailProducer = {
  /**
   * Loads recipients for a campaign, registers them in MySQL, and enqueues high-throughput delivery jobs
   */
  async enqueueCampaignSend(campaignId) {
    // 1. Idempotency protection to prevent duplicate sends
    const idempotencyKey = `campaign_send_${campaignId}`;
    const existingLock = await prisma.idempotencyRecord.findUnique({
      where: { key: idempotencyKey }
    });

    if (existingLock) {
      throw new BadRequestError('Campaign dispatch is already in progress or has been enqueued.');
    }

    await prisma.idempotencyRecord.create({
      data: {
        key: idempotencyKey,
        resourceType: 'Campaign',
        resourceId: campaignId
      }
    });

    // 2. Fetch campaign details with template and target list
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        template: true,
        list: {
          include: {
            members: {
              include: {
                contact: true
              }
            }
          }
        }
      }
    });

    if (!campaign) {
      throw new NotFoundError('Campaign not found.');
    }

    if (!campaign.template) {
      throw new BadRequestError('Campaign has no associated template.');
    }

    // 3. Resolve recipient contacts
    let targetContacts = [];
    if (campaign.list && campaign.list.members.length > 0) {
      targetContacts = campaign.list.members
        .map(m => m.contact)
        .filter(c => c && c.status === 'Active');
    } else {
      // Fallback to all active contacts in workspace if no specific list was chosen
      targetContacts = await prisma.contact.findMany({
        where: { status: 'Active' },
        take: 5000
      });
    }

    if (targetContacts.length === 0) {
      throw new BadRequestError('No active recipients found for this campaign.');
    }

    // 4. Create or ensure CampaignRecipient records in MySQL
    const recipientRecords = [];
    for (const contact of targetContacts) {
      const recipient = await prisma.campaignRecipient.upsert({
        where: {
          campaignId_email: {
            campaignId: campaign.id,
            email: contact.email
          }
        },
        create: {
          campaignId: campaign.id,
          contactId: contact.id,
          email: contact.email,
          status: 'Queued'
        },
        update: {
          status: 'Queued'
        }
      });
      recipientRecords.push({ recipient, contact });
    }

    // 5. Update campaign totals and mark status as Sending
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        status: 'Sending',
        startedAt: new Date(),
        recipientsTotal: recipientRecords.length
      }
    });

    // 6. Record CampaignEvent
    await prisma.campaignEvent.create({
      data: {
        campaignId: campaign.id,
        eventType: 'started',
        dataJson: { recipientCount: recipientRecords.length, enqueuedAt: new Date().toISOString() }
      }
    });

    // 7. Enqueue transmission jobs
    const jobs = recipientRecords.map(({ recipient, contact }) => ({
      name: `campaign-${campaign.id}-${recipient.id}`,
      data: {
        campaignId: campaign.id,
        recipientId: recipient.id,
        email: contact.email,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        subject: campaign.subject,
        templateHtml: campaign.template.htmlContent,
        fromEmail: campaign.senderEmail,
        fromName: campaign.senderName,
        replyTo: campaign.replyToEmail
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
