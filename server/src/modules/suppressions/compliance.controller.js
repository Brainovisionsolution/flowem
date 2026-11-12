import crypto from 'crypto';
import { query } from '../../config/db.js';

export const complianceController = {
  /**
   * Handles RFC 8058 One-Click Unsubscribe (POST) and Web Browser Unsubscribe (GET)
   */
  async handleUnsubscribe(req, res) {
    const email = (req.body?.email || req.query?.email || '').trim().toLowerCase();
    const campaignId = req.body?.campaignId || req.query?.campaignId || null;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || null;

    if (!email || !email.includes('@')) {
      if (req.method === 'GET') {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Unsubscribe - Brainovision</title>
            <style>
              body { font-family: "Cambria Math", Georgia, serif; background-color: #f8fafc; color: #0f172a; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; max-width: 480px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }
              h1 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
              p { font-size: 14px; color: #64748b; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Invalid Unsubscribe Link</h1>
              <p>The unsubscribe link appears to be malformed or missing the recipient email address. Please contact compliance@brainovision.in for assistance.</p>
            </div>
          </body>
          </html>
        `);
      }
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    try {
      // 1. Add to Suppression table in MySQL 8
      const suppId = crypto.randomUUID();
      await query(
        `INSERT INTO suppressions (id, email, reason, source_campaign, notes)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE reason = 'Unsubscribe Request', notes = 'RFC 8058 / User Link Unsubscribe', suppressed_at = NOW()`,
        [suppId, email, 'Unsubscribe Request', campaignId || 'RFC 8058 One-Click Opt-Out', 'Unsubscribe processed via compliance endpoint']
      );

      // 2. Mark Contact as Unsubscribed in MySQL 8
      await query('UPDATE contacts SET status = "Unsubscribed", updated_at = NOW() WHERE email = ?', [email]);

      // 3. Increment campaign unsubscribe count if linked
      if (campaignId) {
        await query('UPDATE campaigns SET unsubscribed_count = unsubscribed_count + 1 WHERE id = ?', [campaignId]).catch(() => {});
      }

      // 4. Record UnsubscribeEvent
      const ueId = crypto.randomUUID();
      await query(
        `INSERT INTO unsubscribe_events (id, email, campaign_id, ip_address, reason) VALUES (?, ?, ?, ?, ?)`,
        [ueId, email, campaignId, typeof ipAddress === 'string' ? ipAddress : null, 'RFC 8058 / User Link Unsubscribe']
      ).catch(() => {});
    } catch (err) {
      console.error('[Compliance] Error processing unsubscribe:', err.message);
    }

    if (req.method === 'POST' || req.headers.accept?.includes('application/json')) {
      return res.status(200).json({
        success: true,
        message: 'Recipient successfully unsubscribed.',
        email
      });
    }

    // Render clean, zero-emoji, Cambria Math confirmation page for GET requests
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Unsubscribed - Brainovision</title>
        <style>
          body {
            font-family: "Cambria Math", Georgia, serif;
            background-color: #f8fafc;
            color: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 14px;
            padding: 44px;
            max-width: 520px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            text-align: center;
          }
          .badge {
            display: inline-block;
            background: #f1f5f9;
            color: #475569;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 16px;
          }
          h1 {
            font-size: 22px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 12px;
            color: #0f172a;
          }
          p {
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .email-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 13px;
            color: #1e293b;
            font-weight: 600;
            word-break: break-all;
            margin-bottom: 24px;
          }
          .footer-text {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 24px;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Compliance Confirmation</div>
          <h1>Successfully Unsubscribed</h1>
          <p>Your email address has been permanently removed from our promotional and automated mailing sequences.</p>
          <div class="email-box">${email}</div>
          <p>You will no longer receive marketing communications from Brainovision. If this was done in error, please contact our support desk.</p>
          <div class="footer-text">Brainovision Solutions India Pvt Ltd &bull; Hyderabad, Telangana, India</div>
        </div>
      </body>
      </html>
    `);
  }
};

