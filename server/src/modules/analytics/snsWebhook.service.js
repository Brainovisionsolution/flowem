import crypto from 'crypto';
import https from 'https';
import { query } from '../../config/db.js';

export const snsWebhookService = {
  /**
   * Processes incoming AWS SNS notification for SES events
   */
  async processSnsPayload(body) {
    // 1. Handle SNS Subscription Confirmation
    if (body.Type === 'SubscriptionConfirmation' && body.SubscribeURL) {
      console.log(`[SNS] Confirming subscription via ${body.SubscribeURL}`);
      await new Promise((resolve) => {
        https.get(body.SubscribeURL, (res) => {
          resolve(res.statusCode);
        }).on('error', (err) => {
          console.error('[SNS] Subscription confirmation request failed:', err.message);
          resolve(false);
        });
      });
      return { success: true, message: 'SNS subscription confirmed.' };
    }

    // 2. Handle SES Notification
    if (body.Type === 'Notification') {
      let messagePayload = body.Message;
      if (typeof messagePayload === 'string') {
        try {
          messagePayload = JSON.parse(messagePayload);
        } catch (e) {
          console.error('[SNS] Failed to parse message body JSON:', e.message);
          return { success: false, error: 'Invalid JSON message' };
        }
      }

      const eventType = messagePayload.eventType || messagePayload.notificationType;
      const mail = messagePayload.mail || {};
      const messageId = mail.messageId || 'unknown';

      let campaignId = null;
      let recipientId = null;

      if (mail.headers) {
        const cHeader = mail.headers.find(h => h.name === 'X-FlowEM-Campaign-Id');
        if (cHeader) campaignId = cHeader.value;
        const rHeader = mail.headers.find(h => h.name === 'X-FlowEM-Recipient-Id');
        if (rHeader) recipientId = rHeader.value;
      }

      if (eventType === 'Bounce') {
        const bounce = messagePayload.bounce || {};
        const bounceType = bounce.bounceType || 'Permanent';
        const bouncedRecipients = bounce.bouncedRecipients || [];

        for (const recipient of bouncedRecipients) {
          const email = recipient.emailAddress?.toLowerCase();
          if (!email) continue;

          if (bounceType === 'Permanent') {
            const suppId = crypto.randomUUID();
            await query(
              `INSERT INTO suppressions (id, email, reason, source_campaign, notes)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE reason = 'Hard Bounce', notes = VALUES(notes), suppressed_at = NOW()`,
              [suppId, email, 'Hard Bounce', campaignId || 'AWS SNS Webhook', recipient.diagnosticCode || 'Permanent delivery failure reported by SES']
            ).catch(() => {});

            await query('UPDATE contacts SET status = "Bounced" WHERE email = ?', [email]).catch(() => {});
          }

          const eeId = crypto.randomUUID();
          await query(
            `INSERT INTO email_events (id, message_id, campaign_id, event_type, recipient_email, raw_payload)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [eeId, messageId, campaignId, 'Bounce', email, JSON.stringify(messagePayload)]
          ).catch(() => {});

          if (campaignId) {
            await query('UPDATE campaigns SET bounced_count = bounced_count + 1 WHERE id = ?', [campaignId]).catch(() => {});
          }
        }
      } else if (eventType === 'Complaint') {
        const complaint = messagePayload.complaint || {};
        const complainedRecipients = complaint.complainedRecipients || [];

        for (const recipient of complainedRecipients) {
          const email = recipient.emailAddress?.toLowerCase();
          if (!email) continue;

          const suppId = crypto.randomUUID();
          await query(
            `INSERT INTO suppressions (id, email, reason, source_campaign, notes)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE reason = 'Spam Complaint', suppressed_at = NOW()`,
            [suppId, email, 'Spam Complaint', campaignId || 'AWS SNS Webhook', 'Spam complaint recorded via AWS SES']
          ).catch(() => {});

          await query('UPDATE contacts SET status = "Complained" WHERE email = ?', [email]).catch(() => {});

          const eeId = crypto.randomUUID();
          await query(
            `INSERT INTO email_events (id, message_id, campaign_id, event_type, recipient_email, raw_payload)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [eeId, messageId, campaignId, 'Complaint', email, JSON.stringify(messagePayload)]
          ).catch(() => {});

          if (campaignId) {
            await query('UPDATE campaigns SET complained_count = complained_count + 1 WHERE id = ?', [campaignId]).catch(() => {});
          }
        }
      } else if (eventType === 'Delivery') {
        const delivery = messagePayload.delivery || {};
        const recipients = delivery.recipients || [];

        for (const email of recipients) {
          const eeId = crypto.randomUUID();
          await query(
            `INSERT INTO email_events (id, message_id, campaign_id, event_type, recipient_email, raw_payload)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [eeId, messageId, campaignId, 'Delivered', email, JSON.stringify(messagePayload)]
          ).catch(() => {});

          if (recipientId) {
            await query(
              'UPDATE campaign_recipients SET status = "Delivered", delivered_at = NOW() WHERE id = ?',
              [recipientId]
            ).catch(() => {});
          }
        }
      } else if (eventType === 'Open') {
        if (campaignId) {
          await query('UPDATE campaigns SET opened_count = opened_count + 1 WHERE id = ?', [campaignId]).catch(() => {});
        }
      } else if (eventType === 'Click') {
        if (campaignId) {
          await query('UPDATE campaigns SET clicked_count = clicked_count + 1 WHERE id = ?', [campaignId]).catch(() => {});
        }
      }

      return { success: true, processedEventType: eventType };
    }

    return { success: true, message: 'SNS payload processed.' };
  }
};
