import { prisma } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../../utils/errors.js';

export const authService = {
  // Public employee registration is disabled in single-admin mode
  async register() {
    throw new ForbiddenError('Public registration is disabled. FlowEM is configured for single-admin operation only.');
  },

  async login(email, password) {
    if (!email || !password) {
      throw new UnauthorizedError('Email and password are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await prisma.user.findFirst({
      where: { email: cleanEmail },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    // Self-healing bootstrap: if database has zero users, check against env ADMIN credentials
    if (!user) {
      const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@brainovision.in').toLowerCase();
      const configuredPassword = process.env.ADMIN_PASSWORD || 'Admin@Flowem2026!';

      if (cleanEmail === configuredEmail && password === configuredPassword) {
        // Auto-bootstrap Admin in database
        const passwordHash = await bcrypt.hash(configuredPassword, 10);
        let adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
        if (!adminRole) {
          adminRole = await prisma.role.create({
            data: { name: 'Admin', description: 'System Administrator', isSystem: true }
          });
        }

        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            name: 'System Administrator',
            passwordHash,
            status: 'Active',
            twoFactorEnabled: false
          },
          include: {
            roles: {
              include: { role: true }
            }
          }
        });

        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: adminRole.id
          }
        });

        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { roles: { include: { role: true } } }
        });
      }
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'Active') {
      throw new UnauthorizedError('Admin account has been deactivated');
    }

    // Update lastLoginAt timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const userRole = user.roles[0]?.role?.name || 'Admin';

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
      throw new NotFoundError('Admin profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roles[0]?.role?.name || 'Admin',
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled
    };
  }
};
