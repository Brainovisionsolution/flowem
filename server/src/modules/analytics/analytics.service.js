import { prisma } from '../../config/db.js';

export const analyticsService = {
  async getOverviewStats() {
    const [
      totalContacts,
      totalCampaigns,
      campaignAggregates,
      suppressionCount,
      orgSettings
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.campaign.count(),
      prisma.campaign.aggregate({
        _sum: {
          sentCount: true,
          deliveredCount: true,
          openedCount: true,
          clickedCount: true,
          bouncedCount: true
        }
      }),
      prisma.suppression.count(),
      prisma.organizationSettings.findFirst()
    ]);

    const sent = campaignAggregates._sum.sentCount || 0;
    const delivered = campaignAggregates._sum.deliveredCount || 0;
    const opens = campaignAggregates._sum.openedCount || 0;
    const clicks = campaignAggregates._sum.clickedCount || 0;
    const bounces = campaignAggregates._sum.bouncedCount || 0;

    const deliveryRate = sent > 0 ? Number(((delivered / sent) * 100).toFixed(2)) : 0;
    const openRate = delivered > 0 ? Number(((opens / delivered) * 100).toFixed(2)) : 0;
    const clickRate = opens > 0 ? Number(((clicks / opens) * 100).toFixed(2)) : 0;
    const bounceRate = sent > 0 ? Number(((bounces / sent) * 100).toFixed(2)) : 0;

    return {
      totalContacts,
      totalCampaigns,
      sentCount: sent,
      deliveredCount: delivered,
      openedCount: opens,
      clickedCount: clicks,
      bouncedCount: bounces,
      suppressionCount,
      deliveryRate,
      openRate,
      clickRate,
      bounceRate,
      monthlyQuota: orgSettings?.monthlyQuota || 100000,
      currentUsage: orgSettings?.currentUsage || 0
    };
  }
};
