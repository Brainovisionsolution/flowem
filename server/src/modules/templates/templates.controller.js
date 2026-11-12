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

  async create(req, res, next) {
    try {
      const template = await templatesService.createTemplate(req.body);
      res.status(201).json(template);
    } catch (err) {
      next(err);
    }
  }
};
