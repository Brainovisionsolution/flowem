import crypto from 'crypto';
import { query } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';

/**
 * Core email processing unit executed for each queued recipient
 */
export async function processEmailRecipient(data) {
  const { campaignId, recipientId, email, firstName, lastName, subject, templateHtml, fromEmail, fromName, replyTo } = data;

  // 1. Pre-send suppression verification in MySQL 8
  const suppRows = await query('SELECT reason FROM suppressions WHERE email = ? LIMIT 1', [email]);

  if (suppRows.length > 0) {
    const reason = suppRows[0].reason;
    if (recipientId) {
      await query(
        'UPDATE campaign_recipients SET status = "Bounced", error_message = ? WHERE id = ?',
        [`Pre-send suppression rule active: ${reason}`, recipientId]
      ).catch(() => {});
    }

    if (campaignId) {
      await query(
        'UPDATE campaigns SET bounced_count = bounced_count + 1 WHERE id = ?',
        [campaignId]
      ).catch(() => {});
      await checkAndFinalizeCampaign(campaignId);
    }

    return { success: false, suppressed: true, reason };
  }

  // 2. Check contact consent & unsubscribed status in MySQL 8
  const contactRows = await query('SELECT id, status FROM contacts WHERE email = ? LIMIT 1', [email]);
  const contact = contactRows[0];

  if (contact && (contact.status === 'Unsubscribed' || contact.status === 'Complained')) {
    if (recipientId) {
      await query(
        'UPDATE campaign_recipients SET status = "Bounced", error_message = ? WHERE id = ?',
        [`Recipient marked as ${contact.status}`, recipientId]
      ).catch(() => {});
    }

    if (campaignId) {
      await query(
        'UPDATE campaigns SET bounced_count = bounced_count + 1 WHERE id = ?',
        [campaignId]
      ).catch(() => {});
      await checkAndFinalizeCampaign(campaignId);
    }

    return { success: false, unsubscribed: true };
  }

  // 3. Organization & postal compliance details
  const orgRows = await query('SELECT * FROM organization_settings LIMIT 1');
  const org = orgRows[0];
  const companyName = org?.company_name || 'Brainovision Solutions India Pvt Ltd';
  const companyAddress = org?.company_address || 'Hyderabad, Telangana, India';
  const baseUrl = process.env.BASE_URL || process.env.APP_URL || 'http://localhost:5000';
  const unsubscribeUrl = `${baseUrl}/api/compliance/unsubscribe?email=${encodeURIComponent(email)}&campaignId=${campaignId || ''}`;

  // 4. HTML Personalization & Trackers
  const compiledHtml = compileEmailHtml(templateHtml || '<p>Hello {{firstName}},</p>', {
    firstName: firstName || 'Valued',
    lastName: lastName || 'Customer',
    email,
    companyName,
    companyAddress,
    unsubscribeUrl,
    tracking: {
      campaignId: campaignId || 'direct',
      recipientId: recipientId || 'direct',
      baseUrl
    }
  });

  const senderAddress = fromEmail || sesClient.getDefaultFromEmail();
  const formattedFrom = fromName ? `"${fromName}" <${senderAddress}>` : senderAddress;

  try {
    // 5. AWS SES Transmission
    const sesResult = await sesClient.sendEmail({
      to: email,
      from: formattedFrom,
      subject: subject || 'Notice from Brainovision',
      html: compiledHtml,
      replyTo: replyTo || undefined
    });

    // 6. Update recipient status in MySQL
    if (recipientId) {
      await query(
        'UPDATE campaign_recipients SET status = "Sent", ses_message_id = ?, sent_at = NOW() WHERE id = ?',
        [sesResult.messageId, recipientId]
      );
    }

    // 7. Record Sent EmailEvent
    const eeId = crypto.randomUUID();
    await query(
      `INSERT INTO email_events (id, message_id, campaign_id, contact_id, event_type, recipient_email, raw_payload)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        eeId,
        sesResult.messageId,
        campaignId || null,
        contact?.id || null,
        'Sent',
        email,
        JSON.stringify({ simulated: sesResult.simulated, region: sesResult.region })
      ]
    );

    // 8. Update campaign metrics
    if (campaignId) {
      await query(
        'UPDATE campaigns SET sent_count = sent_count + 1, delivered_count = delivered_count + 1 WHERE id = ?',
        [campaignId]
      );
      await checkAndFinalizeCampaign(campaignId);
    }

    // 9. Update organization usage
    await query('UPDATE organization_settings SET current_usage = current_usage + 1').catch(() => {});

    return {
      success: true,
      messageId: sesResult.messageId,
      simulated: sesResult.simulated
    };
  } catch (error) {
    console.error(`Email transmission failed for ${email}:`, error.message);

    if (recipientId) {
      await query(
        'UPDATE campaign_recipients SET status = "Failed", error_message = ? WHERE id = ?',
        [error.message, recipientId]
      ).catch(() => {});
    }

    if (campaignId) {
      await query(
        'UPDATE campaigns SET bounced_count = bounced_count + 1 WHERE id = ?',
        [campaignId]
      ).catch(() => {});
      await checkAndFinalizeCampaign(campaignId);
    }

    throw error;
  }
}

/**
 * Checks if all recipients for a campaign have completed and marks the campaign status
 */
async function checkAndFinalizeCampaign(campaignId) {
  try {
    const remainingRows = await query(
      `SELECT COUNT(*) as remaining FROM campaign_recipients WHERE campaign_id = ? AND status IN ('Pending', 'Queued')`,
      [campaignId]
    );

    const remaining = Number(remainingRows[0]?.remaining || 0);

    if (remaining === 0) {
      await query(
        `UPDATE campaigns SET status = 'Completed', completed_at = NOW() WHERE id = ?`,
        [campaignId]
      );
    }
  } catch (err) {
    console.error(`Failed to evaluate campaign completion for ${campaignId}:`, err.message);
  }
}
