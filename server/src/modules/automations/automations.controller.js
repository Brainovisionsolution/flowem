import { automationsService } from './automations.service.js';

export const automationsController = {
  async getAll(req, res, next) {
    try {
      const automations = await automationsService.getAllAutomations();
      res.json(automations);
    } catch (err) {
      next(err);
    }
  },

  async toggle(req, res, next) {
    try {
      const { id } = req.params;
      const result = await automationsService.toggleStatus(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async addStep(req, res, next) {
    try {
      const { id } = req.params;
      const result = await automationsService.addStep(id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async test(req, res, next) {
    try {
      const result = await automationsService.testTrigger();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

