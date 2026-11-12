import { domainsService } from './domains.service.js';

export const domainsController = {
  async getAll(req, res, next) {
    try {
      const domains = await domainsService.getAllDomains();
      res.json(domains);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const domain = await domainsService.createDomain(req.body);
      res.status(201).json(domain);
    } catch (err) {
      next(err);
    }
  },

  async verify(req, res, next) {
    try {
      const { id } = req.params;
      const result = await domainsService.verifyDomain(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getQuota(req, res, next) {
    try {
      const quota = await domainsService.getSendQuota();
      res.json(quota);
    } catch (err) {
      next(err);
    }
  }
};

