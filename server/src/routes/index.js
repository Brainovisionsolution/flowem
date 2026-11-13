import { Router } from 'express';
import { contactsRouter } from '../modules/contacts/contacts.routes.js';
import { listsRouter } from '../modules/lists/lists.routes.js';
import { campaignsRouter } from '../modules/campaigns/campaigns.routes.js';
import { templatesRouter } from '../modules/templates/templates.routes.js';
import { emailsRouter } from '../modules/emails/emails.routes.js';
import { automationsRouter } from '../modules/automations/automations.routes.js';
import { domainsRouter } from '../modules/domains/domains.routes.js';
import { suppressionsRouter } from '../modules/suppressions/suppressions.routes.js';
import { organizationRouter } from '../modules/organization/organization.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';
import { analyticsRouter } from '../modules/analytics/analytics.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { authenticate } from '../modules/auth/auth.middleware.js';
import { v1Router } from '../api/v1/v1.routes.js';
import { snsWebhookController } from '../modules/analytics/snsWebhook.controller.js';
import { trackingController } from '../modules/analytics/tracking.controller.js';
import { complianceController } from '../modules/suppressions/compliance.controller.js';

export const apiRouter = Router();

// Public Health Check Endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'FlowEM High-Throughput Engine',
    database: 'MySQL 8',
    authMode: 'Single Admin'
  });
});

// Authentication Router (Login, Logout, Me)
apiRouter.use('/auth', authRouter);

// Public Tracking Endpoints (Open Pixel & Click Redirect)
apiRouter.get('/track/open/:campaignId/:recipientId', trackingController.handleOpen);
apiRouter.get('/track/click/:campaignId/:recipientId', trackingController.handleClick);

// Public Compliance / Unsubscribe Endpoints (RFC 8058 One-Click + Browser opt-out)
apiRouter.get('/compliance/unsubscribe', complianceController.handleUnsubscribe);
apiRouter.post('/compliance/unsubscribe', complianceController.handleUnsubscribe);

// Public AWS SNS Webhook Receiver (SES Delivery, Bounce, Complaint events)
apiRouter.post('/webhooks/ses-events', snsWebhookController.handleSnsWebhook);

// Programmatic Developer REST API v1 (Protected by API Key)
apiRouter.use('/v1', v1Router);

// Protected Core Modules (Protected by Single Admin JWT / HTTP-only cookie middleware)
apiRouter.use('/contacts', authenticate, contactsRouter);
apiRouter.use('/lists', authenticate, listsRouter);
apiRouter.use('/campaigns', authenticate, campaignsRouter);
apiRouter.use('/templates', authenticate, templatesRouter);
apiRouter.use('/emails', authenticate, emailsRouter);
apiRouter.use('/automations', authenticate, automationsRouter);
apiRouter.use('/domains', authenticate, domainsRouter);
apiRouter.use('/suppressions', authenticate, suppressionsRouter);
apiRouter.use('/organization', authenticate, organizationRouter);
apiRouter.use('/team', authenticate, usersRouter);
apiRouter.use('/users', authenticate, usersRouter);
apiRouter.use('/analytics', authenticate, analyticsRouter);
