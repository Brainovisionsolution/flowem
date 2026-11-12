import { Router } from 'express';
import { v1Controller } from './v1.controller.js';
import { authenticateApiKey } from '../../middleware/apiKeyAuth.js';

export const v1Router = Router();

// Protect all /api/v1/* routes with API key verification
v1Router.use(authenticateApiKey);

v1Router.post('/emails/send', v1Controller.sendEmail);
v1Router.post('/contacts', v1Controller.createContact);
v1Router.get('/contacts', v1Controller.getContacts);
v1Router.post('/campaigns/:id/send', v1Controller.triggerCampaign);
