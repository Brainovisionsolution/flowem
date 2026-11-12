import { prisma } from '../../config/db.js';
import https from 'https';

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

      // Correlate with campaign if headers or tags contain campaign ID
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

          // If hard/permanent bounce, add to suppression list
          if (bounceType === 'Permanent') {
            await prisma.suppression.upsert({
              where: { email },
              create: {
                email,
                reason: 'Hard Bounce',
                sourceCampaign: campaignId || 'AWS SNS Webhook',
                notes: recipient.diagnosticCode || 'Permanent delivery failure reported by SES'
              },
              update: {
                reason: 'Hard Bounce',
                notes: recipient.diagnosticCode || 'Permanent delivery failure updated by SES'
              }
            }).catch(() => {});

            // Update contact status
            await prisma.contact.updateMany({
              where: { email },
              data: { status: 'Bounced' }
            }).catch(() => {});
          }

          // Record email event
          await prisma.emailEvent.create({
            data: {
              messageId,
              campaignId,
              eventType: 'Bounce',
              recipientEmail: email,
              rawPayload: messagePayload
            }
          }).catch(() => {});

          if (campaignId) {
            await prisma.campaign.update({
              where: { id: campaignId },
              data: { bouncedCount: { increment: 1 } }
            }).catch(() => {});
          }
        }
      } else if (eventType === 'Complaint') {
        const complaint = messagePayload.complaint || {};
        const complainedRecipients = complaint.complainedRecipients || [];

        for (const recipient of complainedRecipients) {
          const email = recipient.emailAddress?.toLowerCase();
          if (!email) continue;

          // Automatic suppression on spam complaint
          await prisma.suppression.upsert({
            where: { email },
            create: {
              email,
              reason: 'Spam Complaint',
              sourceCampaign: campaignId || 'AWS SNS Webhook',
              notes: 'Spam complaint recorded via AWS SES'
            },
            update: {
              reason: 'Spam Complaint'
            }
          }).catch(() => {});

          await prisma.contact.updateMany({
            where: { email },
            data: { status: 'Complained' }
          }).catch(() => {});

          await prisma.emailEvent.create({
            data: {
              messageId,
              campaignId,
              eventType: 'Complaint',
              recipientEmail: email,
              rawPayload: messagePayload
            }
          }).catch(() => {});

          if (campaignId) {
            await prisma.campaign.update({
              where: { id: campaignId },
              data: { complainedCount: { increment: 1 } }
            }).catch(() => {});
          }
        }
      } else if (eventType === 'Delivery') {
        const delivery = messagePayload.delivery || {};
        const recipients = delivery.recipients || [];

        for (const email of recipients) {
          await prisma.emailEvent.create({
            data: {
              messageId,
              campaignId,
              eventType: 'Delivered',
              recipientEmail: email,
              rawPayload: messagePayload
            }
          }).catch(() => {});

          if (recipientId) {
            await prisma.campaignRecipient.update({
              where: { id: recipientId },
              data: {
                status: 'Delivered',
                deliveredAt: new Date()
              }
            }).catch(() => {});
          }
        }
      } else if (eventType === 'Open') {
        if (campaignId) {
          await prisma.campaign.update({
            where: { id: campaignId },
            data: { openedCount: { increment: 1 } }
          }).catch(() => {});
        }
      } else if (eventType === 'Click') {
        if (campaignId) {
          await prisma.campaign.update({
            where: { id: campaignId },
            data: { clickedCount: { increment: 1 } }
          }).catch(() => {});
        }
      }

      return { success: true, processedEventType: eventType };
    }

    return { success: true, message: 'SNS payload processed.' };
  }
};
