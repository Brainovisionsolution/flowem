import { Router } from 'express';
import { contactsRouter } from '../modules/contacts/contacts.routes.js';
import { listsRouter } from '../modules/lists/lists.routes.js';
import { campaignsRouter } from '../modules/campaigns/campaigns.routes.js';
import { templatesRouter } from '../modules/templates/templates.routes.js';
import { automationsRouter } from '../modules/automations/automations.routes.js';
import { domainsRouter } from '../modules/domains/domains.routes.js';
import { suppressionsRouter } from '../modules/suppressions/suppressions.routes.js';
import { organizationRouter } from '../modules/organization/organization.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';
import { analyticsRouter } from '../modules/analytics/analytics.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'FlowEM High-Throughput Engine',
    database: 'MySQL 8'
  });
});

// Mount module routers matching existing REST contracts
apiRouter.use('/contacts', contactsRouter);
apiRouter.use('/lists', listsRouter);
apiRouter.use('/campaigns', campaignsRouter);
apiRouter.use('/templates', templatesRouter);
apiRouter.use('/automations', automationsRouter);
apiRouter.use('/domains', domainsRouter);
apiRouter.use('/suppressions', suppressionsRouter);
apiRouter.use('/organization', organizationRouter);
apiRouter.use('/team', usersRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/auth', authRouter);
