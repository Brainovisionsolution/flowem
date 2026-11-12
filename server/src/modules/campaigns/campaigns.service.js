import { prisma } from '../../config/db.js';

export const campaignsService = {
  async getAllCampaigns() {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        list: true
      }
    });

    return campaigns.map(c => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      senderDomain: 'mail.brainovision.in',
      senderEmail: c.senderEmail,
      senderName: c.senderName,
      status: c.status,
      listName: c.list?.name || 'General List',
      recipientsTotal: c.recipientsTotal,
      sentCount: c.sentCount,
      deliveredCount: c.deliveredCount,
      openedCount: c.openedCount,
      clickedCount: c.clickedCount,
      bouncedCount: c.bouncedCount,
      deliveryRate: c.sentCount > 0 ? Number(((c.deliveredCount / c.sentCount) * 100).toFixed(1)) : 0,
      openRate: c.deliveredCount > 0 ? Number(((c.openedCount / c.deliveredCount) * 100).toFixed(1)) : 0,
      clickRate: c.openedCount > 0 ? Number(((c.clickedCount / c.openedCount) * 100).toFixed(1)) : 0,
      createdAt: c.createdAt.toISOString().split('T')[0]
    }));
  },

  async createCampaign(data) {
    const status = data.sendImmediately ? 'Sending' : 'Scheduled';

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name || 'New Campaign',
        subject: data.subject || 'Announcement',
        previewText: data.previewText || '',
        senderName: data.senderName || 'Brainovision Team',
        senderEmail: data.senderEmail || 'noreply@mail.brainovision.in',
        status,
        recipientsTotal: data.recipientsTotal || 0,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        bouncedCount: 0,
        templateId: data.templateId || null,
        listId: data.listId || null
      }
    });

    return {
      id: campaign.id,
      name: campaign.name,
      subject: campaign.subject,
      senderDomain: 'mail.brainovision.in',
      senderEmail: campaign.senderEmail,
      senderName: campaign.senderName,
      status: campaign.status,
      listName: data.listName || 'General List',
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
    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: newStatus }
    });

    return {
      success: true,
      campaign: updated
    };
  }
};

