import { Router } from 'express';
import { templatesController } from './templates.controller.js';

export const templatesRouter = Router();

templatesRouter.get('/', templatesController.getAll);
templatesRouter.post('/send-bulk', templatesController.sendBulk);
templatesRouter.get('/:id', templatesController.getById);
templatesRouter.post('/', templatesController.create);
templatesRouter.put('/:id', templatesController.update);
templatesRouter.delete('/:id', templatesController.delete);
templatesRouter.post('/:id/test-email', templatesController.sendTest);

