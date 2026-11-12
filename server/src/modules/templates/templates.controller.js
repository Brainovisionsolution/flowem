import { templatesService } from './templates.service.js';

export const templatesController = {
  async getAll(req, res, next) {
    try {
      const templates = await templatesService.getAllTemplates();
      res.json(templates);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const template = await templatesService.getTemplateById(id);
      res.json(template);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const template = await templatesService.createTemplate(req.body);
      res.status(201).json(template);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const template = await templatesService.updateTemplate(id, req.body);
      res.json(template);
    } catch (err) {
      next(err);
    }
  },

  async sendTest(req, res, next) {
    try {
      const { id } = req.params;
      const targetEmail = req.body.email || req.user?.email || 'admin@brainovision.in';
      const result = await templatesService.sendTestEmail(id, targetEmail);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await templatesService.deleteTemplate(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async sendBulk(req, res, next) {
    try {
      const result = await templatesService.sendBulkWithTemplate(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
