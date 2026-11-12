import crypto from 'crypto';
import { query } from '../../config/db.js';

// 1x1 transparent GIF buffer
const TRANSPARENT_GIF_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export const trackingController = {
  /**
   * Serves transparent tracking pixel and increments campaign open statistics
   */
  async handleOpen(req, res) {
    const { campaignId, recipientId } = req.params;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || null;
    const userAgent = req.headers['user-agent'] || null;

    try {
      if (campaignId && campaignId !== 'direct') {
        await query('UPDATE campaigns SET opened_count = opened_count + 1 WHERE id = ?', [campaignId]).catch(() => {});

        let recipientEmail = 'unknown@mail.brainovision.in';
        if (recipientId && recipientId !== 'direct') {
          const recRows = await query('SELECT email FROM campaign_recipients WHERE id = ? LIMIT 1', [recipientId]).catch(() => []);
          if (recRows[0]?.email) recipientEmail = recRows[0].email;
        }

        const eeId = crypto.randomUUID();
        await query(
          `INSERT INTO email_events (id, message_id, campaign_id, event_type, recipient_email, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [eeId, `open-${Date.now()}-${recipientId || 'anon'}`, campaignId, 'Open', recipientEmail, typeof ipAddress === 'string' ? ipAddress : null, userAgent]
        ).catch(() => {});
      }
    } catch (err) {
      console.error('[Tracking] Open tracking error:', err.message);
    }

    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': TRANSPARENT_GIF_BUFFER.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(TRANSPARENT_GIF_BUFFER);
  },

  /**
   * Logs link click and redirects recipient to target URL
   */
  async handleClick(req, res) {
    const { campaignId, recipientId } = req.params;
    const targetUrl = req.query.url;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || null;
    const userAgent = req.headers['user-agent'] || null;

    if (!targetUrl) {
      return res.redirect('https://brainovision.in');
    }

    try {
      if (campaignId && campaignId !== 'direct') {
        await query('UPDATE campaigns SET clicked_count = clicked_count + 1 WHERE id = ?', [campaignId]).catch(() => {});

        let recipientEmail = 'unknown@mail.brainovision.in';
        if (recipientId && recipientId !== 'direct') {
          const recRows = await query('SELECT email FROM campaign_recipients WHERE id = ? LIMIT 1', [recipientId]).catch(() => []);
          if (recRows[0]?.email) recipientEmail = recRows[0].email;
        }

        const eeId = crypto.randomUUID();
        await query(
          `INSERT INTO email_events (id, message_id, campaign_id, event_type, recipient_email, link_url, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [eeId, `click-${Date.now()}-${recipientId || 'anon'}`, campaignId, 'Click', recipientEmail, targetUrl, typeof ipAddress === 'string' ? ipAddress : null, userAgent]
        ).catch(() => {});
      }
    } catch (err) {
      console.error('[Tracking] Click tracking error:', err.message);
    }

    return res.redirect(302, targetUrl);
  }
};
