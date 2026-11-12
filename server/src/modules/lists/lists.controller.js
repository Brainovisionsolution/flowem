import { listsService } from './lists.service.js';

export const listsController = {
  async getAll(req, res, next) {
    try {
      const lists = await listsService.getAllLists();
      res.json(lists);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const list = await listsService.createList(req.body);
      res.status(201).json(list);
    } catch (err) {
      next(err);
    }
  },

  async clean(req, res, next) {
    try {
      const { id } = req.params;
      const result = await listsService.cleanList(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
