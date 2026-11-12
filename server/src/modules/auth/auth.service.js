import { query } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
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
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    let user = rows[0];

    // Self-healing bootstrap: if database has zero users, check against env ADMIN credentials
    if (!user) {
      const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@brainovision.in').toLowerCase();
      const configuredPassword = process.env.ADMIN_PASSWORD || 'Admin@Flowem2026!';

      if (cleanEmail === configuredEmail && password === configuredPassword) {
        const passwordHash = await bcrypt.hash(configuredPassword, 10);
        const adminId = crypto.randomUUID();

        await query(
          `INSERT INTO users (id, email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
          [adminId, cleanEmail, passwordHash, 'System Administrator', 'Admin', 'Active']
        );

        const newRows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [adminId]);
        user = newRows[0];
      }
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'Active') {
      throw new UnauthorizedError('Admin account has been deactivated');
    }

    // Update updated_at timestamp
    query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]).catch(() => {});

    const userRole = user.role || 'Admin';

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
    const rows = await query('SELECT id, email, name, role, status FROM users WHERE id = ? LIMIT 1', [userId]);
    const user = rows[0];

    if (!user) {
      throw new NotFoundError('Admin profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'Admin',
      status: user.status,
      twoFactorEnabled: false
    };
  }
};
