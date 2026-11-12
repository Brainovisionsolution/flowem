import { Router } from 'express';
import { listsController } from './lists.controller.js';

export const listsRouter = Router();

listsRouter.get('/', listsController.getAll);
listsRouter.post('/', listsController.create);
listsRouter.post('/:id/clean', listsController.clean);

