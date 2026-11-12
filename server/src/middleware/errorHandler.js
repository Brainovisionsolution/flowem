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

  // MySQL unique constraint violation (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({
      success: false,
      error: 'A record with this identifier already exists in MySQL 8.'
    });
  }

  // MySQL foreign key violation
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452) {
    return res.status(400).json({
      success: false,
      error: 'Referenced foreign record does not exist in MySQL 8.'
    });
  }

  // Default internal server error
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
}

