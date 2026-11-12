import { prisma } from '../../config/db.js';

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
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { openedCount: { increment: 1 } }
        }).catch(() => {});

        let recipientEmail = 'unknown@mail.brainovision.in';
        if (recipientId && recipientId !== 'direct') {
          const rec = await prisma.campaignRecipient.findUnique({
            where: { id: recipientId }
          }).catch(() => null);
          if (rec?.email) recipientEmail = rec.email;
        }

        await prisma.emailEvent.create({
          data: {
            messageId: `open-${Date.now()}-${recipientId || 'anon'}`,
            campaignId,
            eventType: 'Open',
            recipientEmail,
            ipAddress: typeof ipAddress === 'string' ? ipAddress : null,
            userAgent
          }
        }).catch(() => {});
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
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { clickedCount: { increment: 1 } }
        }).catch(() => {});

        let recipientEmail = 'unknown@mail.brainovision.in';
        if (recipientId && recipientId !== 'direct') {
          const rec = await prisma.campaignRecipient.findUnique({
            where: { id: recipientId }
          }).catch(() => null);
          if (rec?.email) recipientEmail = rec.email;
        }

        await prisma.emailEvent.create({
          data: {
            messageId: `click-${Date.now()}-${recipientId || 'anon'}`,
            campaignId,
            eventType: 'Click',
            recipientEmail,
            linkUrl: targetUrl,
            ipAddress: typeof ipAddress === 'string' ? ipAddress : null,
            userAgent
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.error('[Tracking] Click tracking error:', err.message);
    }

    // Redirect to legitimate target destination
    return res.redirect(302, targetUrl);
  }
};
