import { Router } from 'express';
import { organizationController } from './organization.controller.js';

export const organizationRouter = Router();

organizationRouter.get('/', organizationController.get);
organizationRouter.post('/', organizationController.update);
organizationRouter.put('/', organizationController.update);
organizationRouter.post('/keys', organizationController.createKey);
organizationRouter.post('/api-keys', organizationController.createKey);
organizationRouter.delete('/keys/:id', organizationController.deleteKey);
organizationRouter.delete('/api-keys/:id', organizationController.deleteKey);
organizationRouter.post('/webhook/test', organizationController.testWebhook);
organizationRouter.post('/test-webhook', organizationController.testWebhook);
