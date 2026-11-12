import { analyticsService } from './analytics.service.js';

export const analyticsController = {
  async getOverview(req, res, next) {
    try {
      const stats = await analyticsService.getOverviewStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }
};
