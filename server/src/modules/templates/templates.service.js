import { prisma } from '../../config/db.js';

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
  }
};
