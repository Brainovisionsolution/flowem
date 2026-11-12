import { suppressionsService } from './suppressions.service.js';

export const suppressionsController = {
  async getAll(req, res, next) {
    try {
      const records = await suppressionsService.getAllSuppressions();
      res.json(records);
    } catch (err) {
      next(err);
    }
  },

  async add(req, res, next) {
    try {
      const record = await suppressionsService.addSuppression(req.body);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const result = await suppressionsService.removeSuppression(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
