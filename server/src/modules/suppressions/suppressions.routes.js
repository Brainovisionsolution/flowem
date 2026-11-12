import { Router } from 'express';
import { suppressionsController } from './suppressions.controller.js';

export const suppressionsRouter = Router();

suppressionsRouter.get('/', suppressionsController.getAll);
suppressionsRouter.post('/', suppressionsController.add);
suppressionsRouter.delete('/:id', suppressionsController.remove);
