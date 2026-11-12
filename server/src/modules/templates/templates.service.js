import crypto from 'crypto';
import { query } from '../../config/db.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';
import { sesClient } from '../../integrations/aws/sesClient.js';
import { processEmailRecipient } from '../../queue/workers/emailProcessor.js';

export const templatesService = {
  async getAllTemplates() {
    const templates = await query('SELECT * FROM templates ORDER BY updated_at DESC');

    return templates.map(t => ({
      id: t.id,
      title: t.name,
      category: t.category,
      subject: t.subject,
      previewText: t.preview_text || '',
      htmlContent: t.html_content,
      updatedAt: t.updated_at ? new Date(t.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      isPopular: Boolean(t.is_popular)
    }));
  },

  async getTemplateById(id) {
    const rows = await query('SELECT * FROM templates WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) throw new NotFoundError('Template not found');
    const t = rows[0];
    return {
      id: t.id,
      title: t.name,
      category: t.category,
      subject: t.subject,
      previewText: t.preview_text || '',
      htmlContent: t.html_content,
      isPopular: Boolean(t.is_popular)
    };
  },

  async createTemplate(data) {
    const id = crypto.randomUUID();
    const name = data.title || data.name || 'Untitled Template';
    const subject = data.subject || 'FlowEM Announcement';
    const previewText = data.previewText || '';
    const category = data.category || 'Newsletter';
    const htmlContent = data.htmlContent || '<p>Hello {{firstName}},</p>';
    const isPopular = data.isPopular ? 1 : 0;

    await query(
      `INSERT INTO templates (id, name, subject, preview_text, category, html_content, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, subject, previewText, category, htmlContent, isPopular]
    );

    const vId = crypto.randomUUID();
    await query(
      `INSERT INTO template_versions (id, template_id, version_number, html_content) VALUES (?, ?, ?, ?)`,
      [vId, id, 1, htmlContent]
    ).catch(() => {});

    return {
      id,
      title: name,
      category,
      subject,
      previewText,
      htmlContent,
      updatedAt: new Date().toISOString().split('T')[0],
      isPopular: Boolean(isPopular)
    };
  },

  async updateTemplate(id, data) {
    const rows = await query('SELECT * FROM templates WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) throw new NotFoundError('Template not found');
    const existing = rows[0];

    const name = data.title || data.name || existing.name;
    const subject = data.subject || existing.subject;
    const previewText = data.previewText !== undefined ? data.previewText : existing.preview_text;
    const category = data.category || existing.category;
    const htmlContent = data.htmlContent || existing.html_content;

    await query(
      `UPDATE templates SET name = ?, subject = ?, preview_text = ?, category = ?, html_content = ?, updated_at = NOW() WHERE id = ?`,
      [name, subject, previewText, category, htmlContent, id]
    );

    const vCountRows = await query('SELECT COUNT(*) as cnt FROM template_versions WHERE template_id = ?', [id]);
    const nextVer = (vCountRows[0]?.cnt || 0) + 1;
    const vId = crypto.randomUUID();

    await query(
      `INSERT INTO template_versions (id, template_id, version_number, html_content) VALUES (?, ?, ?, ?)`,
      [vId, id, nextVer, htmlContent]
    ).catch(() => {});

    return {
      id,
      title: name,
      category,
      subject,
      previewText,
      htmlContent,
      updatedAt: new Date().toISOString().split('T')[0],
      isPopular: Boolean(existing.is_popular)
    };
  },

  async sendTestEmail(id, targetEmail) {
    const template = await this.getTemplateById(id);
    const orgRows = await query('SELECT * FROM organization_settings LIMIT 1');
    const org = orgRows[0];

    const compiled = compileEmailHtml(template.htmlContent, {
      firstName: 'Admin',
      lastName: 'Tester',
      email: targetEmail,
      companyName: org?.company_name || 'Brainovision Solutions India Pvt Ltd',
      companyAddress: org?.company_address || 'Hyderabad, Telangana, India',
      unsubscribeUrl: 'https://mail.brainovision.in/unsubscribe?test=true'
    });

    const result = await sesClient.sendEmail({
      to: targetEmail,
      subject: `[TEST] ${template.subject}`,
      html: compiled
    });

    return {
      success: true,
      message: `Test email dispatched to ${targetEmail} via Amazon SES.`,
      result
    };
  },

  async deleteTemplate(id) {
    const rows = await query('SELECT id, name FROM templates WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) throw new NotFoundError('Template not found.');

    await query('DELETE FROM template_versions WHERE template_id = ?', [id]).catch(() => {});
    await query('DELETE FROM templates WHERE id = ?', [id]);

    return {
      success: true,
      message: `Template "${rows[0].name}" deleted successfully.`
    };
  },

  async sendBulkWithTemplate({ templateId, senderEmail = 'it@brainovision.in', senderName = 'Brainovision IT Team', subject, recipients = [] }) {
    if (!templateId) throw new BadRequestError('Template ID is required.');
    if (!recipients || recipients.length === 0) throw new BadRequestError('At least one recipient is required.');

    const template = await this.getTemplateById(templateId);
    const finalSubject = (subject || template.subject || 'Notice from Brainovision').trim();
    const finalFromEmail = (senderEmail || 'it@brainovision.in').trim();
    const finalFromName = (senderName || 'Brainovision IT Team').trim();

    // Clean, validate and deduplicate recipients
    const validRecipients = [];
    const seen = new Set();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const r of recipients) {
      const cleanEmail = (r.email || '').trim().toLowerCase();
      if (cleanEmail && emailRegex.test(cleanEmail) && !seen.has(cleanEmail)) {
        seen.add(cleanEmail);
        validRecipients.push({
          email: cleanEmail,
          firstName: (r.firstName || '').trim(),
          lastName: (r.lastName || '').trim()
        });
      }
    }

    if (validRecipients.length === 0) {
      throw new BadRequestError('No valid recipient email addresses found.');
    }

    // 1. Create a campaign record to track this send in campaigns and analytics
    const campaignId = crypto.randomUUID();
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const campaignName = `Send: ${template.title} (${dateFormatted})`;

    await query(
      `INSERT INTO campaigns (
        id, name, subject, preview_text, sender_name, sender_email, reply_to_email,
        template_id, status, recipients_total, sent_count, delivered_count, started_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Sending', ?, 0, 0, NOW())`,
      [
        campaignId,
        campaignName,
        finalSubject,
        template.previewText || '',
        finalFromName,
        finalFromEmail,
        finalFromEmail,
        templateId,
        validRecipients.length
      ]
    );

    // 2. Ensure each recipient is registered in contacts, campaign_recipients, and processed
    let dispatchedCount = 0;
    for (const rec of validRecipients) {
      let contactId = crypto.randomUUID();
      const existingContact = await query('SELECT id FROM contacts WHERE email = ? LIMIT 1', [rec.email]);
      if (existingContact.length > 0) {
        contactId = existingContact[0].id;
      } else {
        await query(
          `INSERT INTO contacts (id, email, first_name, last_name, status, source)
           VALUES (?, ?, ?, ?, 'Active', 'Template Send')
           ON DUPLICATE KEY UPDATE status = 'Active'`,
          [contactId, rec.email, rec.firstName || null, rec.lastName || null]
        ).catch(() => {});
      }

      const recId = crypto.randomUUID();
      await query(
        `INSERT INTO campaign_recipients (id, campaign_id, contact_id, email, status) VALUES (?, ?, ?, ?, 'Queued')`,
        [recId, campaignId, contactId, rec.email]
      );

      try {
        await processEmailRecipient({
          campaignId,
          recipientId: recId,
          email: rec.email,
          firstName: rec.firstName,
          lastName: rec.lastName,
          subject: finalSubject,
          templateHtml: template.htmlContent,
          fromEmail: finalFromEmail,
          fromName: finalFromName,
          replyTo: finalFromEmail
        });
        dispatchedCount++;
      } catch (sendErr) {
        console.error(`Failed to dispatch to ${rec.email}:`, sendErr.message);
      }
    }

    // 3. Mark campaign Completed
    await query(
      `UPDATE campaigns SET status = 'Completed', completed_at = NOW() WHERE id = ?`,
      [campaignId]
    );

    return {
      success: true,
      campaignId,
      campaignName,
      totalRecipients: validRecipients.length,
      totalSent: dispatchedCount,
      senderEmail: finalFromEmail,
      message: `Dispatched ${dispatchedCount} email(s) from ${finalFromEmail} using template "${template.title}".`
    };
  }
};
