import { prisma } from '../../config/db.js';
import { emailProducer } from '../../queue/producers/emailProducer.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

export const campaignsService = {
  async getAllCampaigns() {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        list: true,
        template: true
      }
    });

    return campaigns.map(c => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      senderDomain: c.senderEmail.includes('@') ? c.senderEmail.split('@')[1] : 'mail.brainovision.in',
      senderEmail: c.senderEmail,
      senderName: c.senderName,
      status: c.status,
      listName: c.list?.name || 'General Audience',
      listId: c.listId,
      templateId: c.templateId,
      templateTitle: c.template?.name,
      recipientsTotal: c.recipientsTotal,
      sentCount: c.sentCount,
      deliveredCount: c.deliveredCount,
      openedCount: c.openedCount,
      clickedCount: c.clickedCount,
      bouncedCount: c.bouncedCount,
      deliveryRate: c.sentCount > 0 ? Number(((c.deliveredCount / c.sentCount) * 100).toFixed(1)) : 0,
      openRate: c.deliveredCount > 0 ? Number(((c.openedCount / c.deliveredCount) * 100).toFixed(1)) : 0,
      clickRate: c.openedCount > 0 ? Number(((c.clickedCount / c.openedCount) * 100).toFixed(1)) : 0,
      scheduledAt: c.scheduledAt ? c.scheduledAt.toISOString() : null,
      createdAt: c.createdAt.toISOString().split('T')[0]
    }));
  },

  async getCampaignById(id) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        list: true,
        template: true,
        recipients: {
          take: 100,
          orderBy: { sentAt: 'desc' }
        },
        campaignEvents: {
          take: 50,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!campaign) throw new NotFoundError('Campaign not found.');

    return {
      ...campaign,
      deliveryRate: campaign.sentCount > 0 ? Number(((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1)) : 0,
      openRate: campaign.deliveredCount > 0 ? Number(((campaign.openedCount / campaign.deliveredCount) * 100).toFixed(1)) : 0,
      clickRate: campaign.openedCount > 0 ? Number(((campaign.clickedCount / campaign.openedCount) * 100).toFixed(1)) : 0
    };
  },

  async createCampaign(data) {
    // If no template is selected, pick the first template or default
    let templateId = data.templateId;
    if (!templateId) {
      const defaultTpl = await prisma.template.findFirst();
      templateId = defaultTpl?.id;
    }

    const initialStatus = data.sendImmediately ? 'Preparing' : (data.scheduledAt ? 'Scheduled' : 'Draft');

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name || 'New Campaign',
        subject: data.subject || 'Announcement from Brainovision',
        previewText: data.previewText || '',
        senderName: data.senderName || 'Brainovision Team',
        senderEmail: data.senderEmail || 'noreply@mail.brainovision.in',
        replyToEmail: data.replyToEmail || 'support@brainovision.in',
        status: initialStatus,
        recipientsTotal: data.recipientsTotal || 0,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        bouncedCount: 0,
        templateId: templateId || null,
        listId: data.listId || null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null
      },
      include: {
        list: true,
        template: true
      }
    });

    // If immediate send is requested, trigger background enqueue
    if (data.sendImmediately) {
      emailProducer.enqueueCampaignSend(campaign.id).catch((err) => {
        console.error(`Failed to enqueue immediate campaign ${campaign.id}:`, err.message);
      });
    }

    return {
      id: campaign.id,
      name: campaign.name,
      subject: campaign.subject,
      senderDomain: campaign.senderEmail.includes('@') ? campaign.senderEmail.split('@')[1] : 'mail.brainovision.in',
      senderEmail: campaign.senderEmail,
      senderName: campaign.senderName,
      status: data.sendImmediately ? 'Sending' : campaign.status,
      listName: campaign.list?.name || 'General List',
      recipientsTotal: campaign.recipientsTotal,
      sentCount: campaign.sentCount,
      deliveredCount: campaign.deliveredCount,
      openedCount: campaign.openedCount,
      clickedCount: campaign.clickedCount,
      bouncedCount: campaign.bouncedCount,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: campaign.createdAt.toISOString().split('T')[0]
    };
  },

  async updateStatus(id, newStatus) {
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Campaign not found.');

    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: newStatus }
    });

    // Record status transition in campaign events
    await prisma.campaignEvent.create({
      data: {
        campaignId: id,
        eventType: newStatus.toLowerCase(),
        dataJson: { previousStatus: existing.status, updatedStatus: newStatus }
      }
    });

    // If transitioned to Sending and was previously Draft/Paused, start queuing
    if (newStatus === 'Sending' && existing.status !== 'Sending') {
      emailProducer.enqueueCampaignSend(id).catch(err => {
        console.error(`Error dispatching campaign ${id}:`, err.message);
      });
    }

    return {
      success: true,
      campaign: updated
    };
  },

  async deleteCampaign(id) {
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundError('Campaign not found.');

    await prisma.campaign.delete({ where: { id } });
    return { success: true, message: 'Campaign deleted.' };
  }
};
