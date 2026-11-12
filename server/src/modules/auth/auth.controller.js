import { authService } from './auth.service.js';

export const authController = {
  async register(req, res, next) {
    try {
      await authService.register(req.body);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set HTTP-only secure cookie for browser sessions
      res.cookie('flowem_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      res.clearCookie('flowem_token', {
        httpOnly: true,
        sameSite: 'lax'
      });
      res.json({ success: true, message: 'Admin logged out successfully' });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
};
