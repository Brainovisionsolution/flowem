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
      const { items } = req.body;
      const result = await contactsService.importBatch(items || []);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
};

