import { campaignsService } from './campaigns.service.js';

export const campaignsController = {
  async getAll(req, res, next) {
    try {
      const campaigns = await campaignsService.getAllCampaigns();
      res.json(campaigns);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignsService.getCampaignById(id);
      res.json(campaign);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const campaign = await campaignsService.createCampaign(req.body);
      res.status(201).json(campaign);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await campaignsService.updateStatus(id, status);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const result = await campaignsService.deleteCampaign(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
