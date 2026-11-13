import crypto from 'crypto';
import { query } from '../../config/db.js';
import { sesClient } from '../../integrations/aws/sesClient.js';
import { BadRequestError } from '../../utils/errors.js';

export const emailsService = {
  /**
   * Dispatches an individual or transactional email via Amazon SES v2 and records history in MySQL 8
   */
  async sendEmail({ to, subject, html, text, from, replyTo }) {
    if (!to || (Array.isArray(to) && to.length === 0)) {
      throw new BadRequestError('Recipient email (to) is required.');
    }

    const recipientEmail = (Array.isArray(to) ? to[0] : to).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new BadRequestError(`Invalid recipient email syntax: ${recipientEmail}`);
    }

    const emailSubject = (subject || 'Notice from Brainovision').trim();
    const emailHtml = html || (text ? `<p style="font-family: sans-serif; white-space: pre-wrap;">${text}</p>` : '<p>Hello,</p>');
    const senderAddress = (from || sesClient.getDefaultFromEmail() || 'it@brainovision.in').trim();

    // 1. Suppression check
    const suppRows = await query('SELECT reason FROM suppressions WHERE email = ? LIMIT 1', [recipientEmail]);
    if (suppRows.length > 0) {
      throw new BadRequestError(`Recipient is suppressed: ${suppRows[0].reason}`);
    }

    // 2. Transmit via Amazon SES v2 SDK
    const sesResult = await sesClient.sendEmail({
      to: recipientEmail,
      from: senderAddress,
      subject: emailSubject,
      html: emailHtml,
      text: text || undefined,
      replyTo: replyTo || senderAddress
    });

    const logId = crypto.randomUUID();

    // 3. Store email history in MySQL 8 email_logs table
    try {
      await query(
        `INSERT INTO email_logs (id, recipient, subject, sender_email, ses_message_id, status, html_content, sent_at)
         VALUES (?, ?, ?, ?, ?, 'Sent', ?, NOW())`,
        [logId, recipientEmail, emailSubject, senderAddress, sesResult.messageId, emailHtml]
      );
    } catch (dbErr) {
      // Self-healing: if email_logs table was not yet created, create it and insert
      if (dbErr.code === 'ER_NO_SUCH_TABLE' || dbErr.errno === 1146) {
        await query(`
          CREATE TABLE IF NOT EXISTS email_logs (
            id VARCHAR(36) PRIMARY KEY,
            recipient VARCHAR(191) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            sender_email VARCHAR(191) NOT NULL,
            ses_message_id VARCHAR(191) NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'Sent',
            html_content LONGTEXT NULL,
            error_message TEXT NULL,
            sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_el_recipient (recipient),
            INDEX idx_el_msg (ses_message_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await query(
          `INSERT INTO email_logs (id, recipient, subject, sender_email, ses_message_id, status, html_content, sent_at)
           VALUES (?, ?, ?, ?, ?, 'Sent', ?, NOW())`,
          [logId, recipientEmail, emailSubject, senderAddress, sesResult.messageId, emailHtml]
        );
      } else {
        console.error('Failed to write to email_logs:', dbErr.message);
      }
    }

    // 4. Record event in email_events
    const eventId = crypto.randomUUID();
    await query(
      `INSERT INTO email_events (id, message_id, event_type, recipient_email, raw_payload)
       VALUES (?, ?, 'Sent', ?, ?)`,
      [eventId, sesResult.messageId, recipientEmail, JSON.stringify({ simulated: sesResult.simulated, region: sesResult.region })]
    ).catch(() => {});

    // 5. Update organization usage
    await query('UPDATE organization_settings SET current_usage = current_usage + 1').catch(() => {});

    return {
      success: true,
      logId,
      messageId: sesResult.messageId,
      recipient: recipientEmail,
      sender: senderAddress,
      subject: emailSubject,
      simulated: sesResult.simulated,
      region: sesResult.region,
      timestamp: sesResult.timestamp || new Date().toISOString(),
      message: sesResult.simulated
        ? `[Simulator] Test email processed for ${recipientEmail}. Add AWS credentials in server/.env to transmit live.`
        : `Email dispatched successfully via Amazon SES v2 to ${recipientEmail} (MessageId: ${sesResult.messageId}).`
    };
  },

  /**
   * Retrieves recent email send history from MySQL 8
   */
  async getEmailLogs(limit = 50) {
    try {
      const rows = await query(
        `SELECT id, recipient, subject, sender_email, ses_message_id, status, sent_at
         FROM email_logs
         ORDER BY sent_at DESC
         LIMIT ?`,
        [parseInt(limit, 10) || 50]
      );
      return rows;
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146) {
        return [];
      }
      throw err;
    }
  }
};
