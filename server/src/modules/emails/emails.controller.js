import { emailsService } from './emails.service.js';

export const emailsController = {
  /**
   * POST /api/emails/send
   * Dispatches email via Amazon SES v2
   */
  async send(req, res, next) {
    try {
      const result = await emailsService.sendEmail(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/emails/history
   * Lists email send logs
   */
  async getHistory(req, res, next) {
    try {
      const limit = req.query.limit || 50;
      const history = await emailsService.getEmailLogs(limit);
      res.json(history);
    } catch (err) {
      next(err);
    }
  }
};
