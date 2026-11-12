import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma, checkDatabaseConnection } from './config/db.js';

const app = createApp();

async function bootstrap() {
  logger.info('Initializing FlowEM High-Throughput Bulk Email Platform...');
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Test MySQL 8 database connectivity
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    logger.warn('MySQL 8 connection could not be established immediately. Verify DATABASE_URL in server/.env.');
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`FlowEM API Server active and listening on port ${env.PORT}`);
    logger.info(`Local Health Endpoint: http://localhost:${env.PORT}/api/health`);
  });

  // Graceful shutdown handling
  async function shutdown(signal) {
    logger.info(`Received ${signal}. Shutting down FlowEM gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed');
      await prisma.$disconnect();
      logger.info('Database connections disconnected');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error('Fatal error during FlowEM server bootstrap:', err);
  process.exit(1);
});

