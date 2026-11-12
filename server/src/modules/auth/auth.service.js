import { prisma } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../utils/errors.js';

export const authService = {
  async register(data) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // If first user, make Owner; otherwise Viewer or Campaign Creator
    const userCount = await prisma.user.count();
    const roleName = userCount === 0 ? 'Owner' : (data.role || 'Campaign Creator');

    let role = await prisma.role.findUnique({
      where: { name: roleName }
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleName,
          description: `${roleName} role`
        }
      });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name || data.email.split('@')[0],
        status: 'Active'
      }
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role.name
      }
    };
  },

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'Active') {
      throw new UnauthorizedError('Your account has been deactivated or suspended');
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const userRole = user.roles[0]?.role?.name || 'Viewer';

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: userRole },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole
      }
    };
  },

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roles[0]?.role?.name || 'Viewer',
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled
    };
  }
};
