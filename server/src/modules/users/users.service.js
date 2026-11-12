import { query } from '../../config/db.js';
import { ForbiddenError } from '../../utils/errors.js';

export const usersService = {
  async getAllUsers() {
    const users = await query('SELECT * FROM users ORDER BY created_at DESC');

    if (users.length === 0) {
      return [{
        id: 'admin-master',
        name: 'System Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@brainovision.in',
        role: 'Admin',
        status: 'Active',
        twoFactorEnabled: false,
        lastLogin: 'Active Now'
      }];
    }

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'Admin',
      status: u.status,
      twoFactorEnabled: false,
      lastLogin: u.updated_at ? new Date(u.updated_at).toISOString().split('T')[0] : 'Active'
    }));
  },

  async inviteUser(data) {
    throw new ForbiddenError('Teammate invitations are disabled. FlowEM is currently configured for Single Admin access only.');
  },

  async removeUser(id) {
    throw new ForbiddenError('The primary Administrator account cannot be removed.');
  }
};
