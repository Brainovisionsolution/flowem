import { usersService } from './users.service.js';

export const usersController = {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async invite(req, res, next) {
    try {
      const user = await usersService.inviteUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const result = await usersService.removeUser(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

