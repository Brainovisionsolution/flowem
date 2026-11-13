import { Router } from 'express';
import { emailsController } from './emails.controller.js';

export const emailsRouter = Router();

// Endpoint for sending individual/test emails via Amazon SES v2
emailsRouter.post('/send', emailsController.send);

// Endpoint for retrieving sent email history
emailsRouter.get('/history', emailsController.getHistory);
