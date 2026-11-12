import { query } from '../../config/db.js';

export const analyticsService = {
  async getOverviewStats() {
    const [
      contactRows,
      campaignRows,
      aggregateRows,
      suppressionRows,
      orgRows
    ] = await Promise.all([
      query('SELECT COUNT(*) as total FROM contacts'),
      query('SELECT COUNT(*) as total FROM campaigns'),
      query(`
        SELECT
          COALESCE(SUM(sent_count), 0) as total_sent,
          COALESCE(SUM(delivered_count), 0) as total_delivered,
          COALESCE(SUM(opened_count), 0) as total_opened,
          COALESCE(SUM(clicked_count), 0) as total_clicked,
          COALESCE(SUM(bounced_count), 0) as total_bounced
        FROM campaigns
      `),
      query('SELECT COUNT(*) as total FROM suppressions'),
      query('SELECT * FROM organization_settings LIMIT 1')
    ]);

    const totalContacts = Number(contactRows[0]?.total || 0);
    const totalCampaigns = Number(campaignRows[0]?.total || 0);
    const agg = aggregateRows[0] || {};
    const sent = Number(agg.total_sent || 0);
    const delivered = Number(agg.total_delivered || 0);
    const opens = Number(agg.total_opened || 0);
    const clicks = Number(agg.total_clicked || 0);
    const bounces = Number(agg.total_bounced || 0);
    const suppressionCount = Number(suppressionRows[0]?.total || 0);
    const org = orgRows[0] || {};

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
      monthlyQuota: org?.monthly_quota || 100000,
      currentUsage: org?.current_usage || 0
    };
  }
};
