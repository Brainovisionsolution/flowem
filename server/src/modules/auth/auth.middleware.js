import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors.js';

export function authenticate(req, res, next) {
  let token = null;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.flowem_token) {
    token = req.cookies.flowem_token;
  }
  // 2. Fall back to Authorization: Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('Admin authentication required. Please log in.'));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired authentication session. Please log in again.'));
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not possess the required permissions to perform this action'));
    }
    next();
  };
}

