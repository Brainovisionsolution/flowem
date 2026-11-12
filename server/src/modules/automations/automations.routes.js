import { Router } from 'express';
import { automationsController } from './automations.controller.js';

export const automationsRouter = Router();

automationsRouter.get('/', automationsController.getAll);
automationsRouter.post('/:id/toggle', automationsController.toggle);
automationsRouter.patch('/:id/toggle', automationsController.toggle);
automationsRouter.post('/:id/steps', automationsController.addStep);
automationsRouter.post('/:id/step', automationsController.addStep);
automationsRouter.post('/test', automationsController.test);
