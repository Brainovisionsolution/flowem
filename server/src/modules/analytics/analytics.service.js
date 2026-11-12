import { query } from '../../config/db.js';

export const analyticsService = {
  async getOverviewStats() {
    const [
      contactRows,
      campaignRows,
      aggregateRows,
      suppressionRows,
      eventRows,
      recentSends,
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
      query("SELECT COUNT(*) as total FROM email_events WHERE event_type = 'Sent'"),
      query(`
        SELECT c.id, c.name, c.subject, c.sender_email, c.status, c.recipients_total,
               c.sent_count, c.delivered_count, c.opened_count, c.clicked_count, c.created_at
        FROM campaigns c
        ORDER BY c.created_at DESC
        LIMIT 10
      `),
      query('SELECT * FROM organization_settings LIMIT 1')
    ]);

    const totalContacts = Number(contactRows[0]?.total || 0);
    const totalCampaigns = Number(campaignRows[0]?.total || 0);
    const agg = aggregateRows[0] || {};
    const sentFromEvents = Number(eventRows[0]?.total || 0);
    const sent = Math.max(Number(agg.total_sent || 0), sentFromEvents);
    const delivered = Math.max(Number(agg.total_delivered || 0), sent);
    const opens = Number(agg.total_opened || 0);
    const clicks = Number(agg.total_clicked || 0);
    const bounces = Number(agg.total_bounced || 0);
    const suppressionCount = Number(suppressionRows[0]?.total || 0);
    const org = orgRows[0] || {};

    const deliveryRate = sent > 0 ? Number(((delivered / sent) * 100).toFixed(2)) : 100.0;
    const openRate = delivered > 0 ? Number(((opens / delivered) * 100).toFixed(2)) : 0.0;
    const clickRate = opens > 0 ? Number(((clicks / opens) * 100).toFixed(2)) : 0.0;
    const bounceRate = sent > 0 ? Number(((bounces / sent) * 100).toFixed(2)) : 0.0;

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
      currentUsage: sent,
      recentSends: recentSends.map(s => ({
        id: s.id,
        name: s.name,
        subject: s.subject,
        senderEmail: s.sender_email,
        status: s.status,
        recipientsTotal: s.recipients_total,
        sentCount: s.sent_count,
        deliveredCount: s.delivered_count,
        openedCount: s.opened_count,
        clickedCount: s.clicked_count,
        createdAt: s.created_at ? new Date(s.created_at).toISOString() : new Date().toISOString()
      }))
    };
  }
};
