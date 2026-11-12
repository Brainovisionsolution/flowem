import { Router } from 'express';
import { campaignsController } from './campaigns.controller.js';

export const campaignsRouter = Router();

campaignsRouter.get('/', campaignsController.getAll);
campaignsRouter.get('/:id', campaignsController.getById);
campaignsRouter.post('/', campaignsController.create);
campaignsRouter.post('/:id/status', campaignsController.updateStatus);
campaignsRouter.patch('/:id/status', campaignsController.updateStatus);
campaignsRouter.delete('/:id', campaignsController.remove);
