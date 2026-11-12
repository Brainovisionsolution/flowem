import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

// Initialize Prisma Client for MySQL 8
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  errorFormat: 'pretty'
});

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1 as health_check`;
    logger.info('Connected to MySQL 8 database successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to MySQL 8 database:', error.message);
    return false;
  }
}
