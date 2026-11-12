import { prisma } from '../../config/db.js';
import { ForbiddenError } from '../../utils/errors.js';

export const usersService = {
  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (users.length === 0) {
      // Return single admin representation
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
      role: u.roles[0]?.role?.name || 'Admin',
      status: u.status,
      twoFactorEnabled: u.twoFactorEnabled,
      lastLogin: u.lastLoginAt ? u.lastLoginAt.toISOString().split('T')[0] : 'Active'
    }));
  },

  async inviteUser(data) {
    throw new ForbiddenError('Teammate invitations are disabled. FlowEM is currently configured for Single Admin access only.');
  },

  async removeUser(id) {
    throw new ForbiddenError('The primary Administrator account cannot be removed.');
  }
};
