import { Router } from 'express';
import { usersController } from './users.controller.js';

export const usersRouter = Router();

usersRouter.get('/', usersController.getAll);
usersRouter.post('/', usersController.invite);
usersRouter.delete('/:id', usersController.remove);

