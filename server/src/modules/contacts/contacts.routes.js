import { Router } from 'express';
import { contactsController } from './contacts.controller.js';

export const contactsRouter = Router();

contactsRouter.get('/', contactsController.getAll);
contactsRouter.post('/', contactsController.create);
contactsRouter.delete('/:id', contactsController.delete);
contactsRouter.post('/import', contactsController.importCsv);

