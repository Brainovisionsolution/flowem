import { contactsService } from './contacts.service.js';

export const contactsController = {
  async getAll(req, res, next) {
    try {
      const { search } = req.query;
      const contacts = await contactsService.getAllContacts(search);
      res.json(contacts);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const contact = await contactsService.createContact(req.body);
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const contact = await contactsService.updateContact(id, req.body);
      res.json(contact);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await contactsService.deleteContact(id);
      res.json({ success: true, message: 'Contact deleted' });
    } catch (err) {
      next(err);
    }
  },

  async importCsv(req, res, next) {
    try {
      const { items, filename } = req.body;
      const result = await contactsService.importBatch(items || [], filename);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async exportCsv(req, res, next) {
    try {
      const csv = await contactsService.exportContactsCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="flowem_contacts.csv"');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
};
