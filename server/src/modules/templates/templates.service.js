import crypto from 'crypto';
import { query } from '../../config/db.js';
import { NotFoundError } from '../../utils/errors.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';
import { sesClient } from '../../integrations/aws/sesClient.js';

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
  }
};
