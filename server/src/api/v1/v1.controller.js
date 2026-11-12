import { contactsService } from '../../modules/contacts/contacts.service.js';
import { campaignsService } from '../../modules/campaigns/campaigns.service.js';
import { emailProducer } from '../../queue/producers/emailProducer.js';
import { query } from '../../config/db.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export const v1Controller = {
  /**
   * POST /api/v1/emails/send
   * Dispatches or enqueues a transactional email
   */
  async sendEmail(req, res, next) {
    try {
      const { to, subject, html, templateId, variables, fromName, fromEmail, replyTo } = req.body;

      if (!to || !to.includes('@')) {
        throw new BadRequestError('Recipient "to" email address is required.');
      }

      if (!subject) {
        throw new BadRequestError('"subject" line is required.');
      }

      let emailHtml = html;
      if (!emailHtml && templateId) {
        const tplRows = await query('SELECT html_content FROM templates WHERE id = ? LIMIT 1', [templateId]);
        if (tplRows[0]?.html_content) emailHtml = tplRows[0].html_content;
      }

      if (!emailHtml) {
        throw new BadRequestError('Either "html" body or a valid "templateId" is required.');
      }

      const jobResult = await emailProducer.enqueueTransactionalEmail({
        to,
        subject,
        html: emailHtml,
        variables: variables || {},
        fromName,
        fromEmail,
        replyTo
      });

      res.status(202).json({
        success: true,
        message: 'Transactional email queued for delivery.',
        jobId: jobResult.id
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/contacts
   * Programmatically registers a contact
   */
  async createContact(req, res, next) {
    try {
      const contact = await contactsService.createContact({
        ...req.body,
        source: 'API'
      });
      res.status(201).json({ success: true, contact });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/contacts
   * Lists contacts
   */
  async getContacts(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '50', 10);
      const search = req.query.search || '';

      const contacts = await contactsService.getAllContacts({
        search,
        status: req.query.status
      });

      res.json({
        success: true,
        page,
        total: contacts.length,
        contacts: contacts.slice((page - 1) * limit, page * limit)
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/campaigns/:id/send
   * Programmatically triggers a campaign
   */
  async triggerCampaign(req, res, next) {
    try {
      const { id } = req.params;
      const result = await campaignsService.updateStatus(id, 'Sending');
      res.json({ success: true, message: 'Campaign dispatch sequence initiated.', campaign: result.campaign });
    } catch (err) {
      next(err);
    }
  }
};

