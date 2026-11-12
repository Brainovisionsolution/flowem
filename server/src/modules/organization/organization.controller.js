import { organizationService } from './organization.service.js';

export const organizationController = {
  async get(req, res, next) {
    try {
      const settings = await organizationService.getSettings();
      res.json(settings);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const settings = await organizationService.updateSettings(req.body);
      res.json(settings);
    } catch (err) {
      next(err);
    }
  },

  async createKey(req, res, next) {
    try {
      const { name } = req.body;
      const key = await organizationService.createApiKey(name);
      res.status(201).json(key);
    } catch (err) {
      next(err);
    }
  },

  async deleteKey(req, res, next) {
    try {
      const { id } = req.params;
      const result = await organizationService.deleteApiKey(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async testWebhook(req, res, next) {
    try {
      const { url } = req.body;
      const result = await organizationService.testWebhook(url);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

