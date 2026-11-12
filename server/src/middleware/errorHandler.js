import { AppError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error(`[${req.method} ${req.url}] ${err.message}`, err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || undefined
    });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const target = err.meta?.target ? `Duplicate field: ${err.meta.target}` : 'Resource already exists';
    return res.status(409).json({
      success: false,
      error: target
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Requested record not found in database'
    });
  }

  // Default internal server error
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
}
