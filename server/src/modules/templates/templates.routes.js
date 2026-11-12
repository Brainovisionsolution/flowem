import { Router } from 'express';
import { templatesController } from './templates.controller.js';

export const templatesRouter = Router();

templatesRouter.get('/', templatesController.getAll);
templatesRouter.post('/', templatesController.create);
