import { Router } from 'express';
import { domainsController } from './domains.controller.js';

export const domainsRouter = Router();

domainsRouter.get('/', domainsController.getAll);
domainsRouter.post('/', domainsController.create);
domainsRouter.post('/:id/verify', domainsController.verify);

