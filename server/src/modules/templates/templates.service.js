import { prisma } from '../../config/db.js';
import { NotFoundError } from '../../utils/errors.js';
import { compileEmailHtml } from '../../utils/emailCompiler.js';
import { sesClient } from '../../integrations/aws/sesClient.js';

export const templatesService = {
  async getAllTemplates() {
    const templates = await prisma.template.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    return templates.map(t => ({
      id: t.id,
      title: t.name,
      category: t.category,
      subject: t.subject,
      previewText: t.previewText || '',
      htmlContent: t.htmlContent,
      updatedAt: t.updatedAt.toISOString().split('T')[0],
      isPopular: t.isPopular
    }));
  },

  async getTemplateById(id) {
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundError('Template not found');
    return template;
  },

  async createTemplate(data) {
    const template = await prisma.template.create({
      data: {
        name: data.title || data.name || 'Untitled Template',
        subject: data.subject || 'FlowEM Announcement',
        previewText: data.previewText || '',
        category: data.category || 'Newsletter',
        htmlContent: data.htmlContent || '<p>Hello {{firstName}},</p>',
        editorJson: data.editorJson || null,
        isPopular: data.isPopular || false
      }
    });

    // Record version 1
    await prisma.templateVersion.create({
      data: {
        templateId: template.id,
        versionNumber: 1,
        htmlContent: template.htmlContent,
        editorJson: template.editorJson || null
      }
    }).catch(() => {});

    return {
      id: template.id,
      title: template.name,
      category: template.category,
      subject: template.subject,
      previewText: template.previewText || '',
      htmlContent: template.htmlContent,
      updatedAt: template.updatedAt.toISOString().split('T')[0],
      isPopular: template.isPopular
    };
  },

  async updateTemplate(id, data) {
    const existing = await prisma.template.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Template not found');

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name: data.title || data.name || existing.name,
        subject: data.subject || existing.subject,
        previewText: data.previewText !== undefined ? data.previewText : existing.previewText,
        category: data.category || existing.category,
        htmlContent: data.htmlContent || existing.htmlContent,
        editorJson: data.editorJson || existing.editorJson
      }
    });

    // Count versions to increment
    const versionCount = await prisma.templateVersion.count({ where: { templateId: id } });
    await prisma.templateVersion.create({
      data: {
        templateId: id,
        versionNumber: versionCount + 1,
        htmlContent: updated.htmlContent,
        editorJson: updated.editorJson || null
      }
    }).catch(() => {});

    return {
      id: updated.id,
      title: updated.name,
      category: updated.category,
      subject: updated.subject,
      previewText: updated.previewText || '',
      htmlContent: updated.htmlContent,
      updatedAt: updated.updatedAt.toISOString().split('T')[0],
      isPopular: updated.isPopular
    };
  },

  async sendTestEmail(id, targetEmail) {
    const template = await this.getTemplateById(id);
    const org = await prisma.organizationSettings.findFirst();

    const compiled = compileEmailHtml(template.htmlContent, {
      firstName: 'Admin',
      lastName: 'Tester',
      email: targetEmail,
      companyName: org?.companyName || 'Brainovision Solutions India Pvt Ltd',
      companyAddress: org?.companyAddress || 'Hyderabad, Telangana, India',
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
