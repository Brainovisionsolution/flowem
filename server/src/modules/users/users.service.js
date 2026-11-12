import { prisma } from '../../config/db.js';

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

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.roles[0]?.role?.name || 'Viewer',
      status: u.status,
      twoFactorEnabled: u.twoFactorEnabled,
      lastLogin: u.lastLoginAt ? u.lastLoginAt.toISOString().split('T')[0] : 'Never'
    }));
  },

  async inviteUser(data) {
    // Check if role exists or find it
    let role = await prisma.role.findFirst({
      where: { name: data.role || 'Campaign Creator' }
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: data.role || 'Campaign Creator',
          description: 'Team campaign creator role'
        }
      });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name || data.email.split('@')[0],
        email: data.email,
        passwordHash: 'pending_invitation_hash',
        status: 'Invited',
        twoFactorEnabled: false
      }
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role.name,
      status: 'Invited',
      twoFactorEnabled: false,
      lastLogin: 'Never'
    };
  },

  async removeUser(id) {
    await prisma.user.delete({
      where: { id }
    });
    return { success: true };
  }
};
