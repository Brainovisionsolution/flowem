import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { checkDatabaseConnection, getDbPool } from './config/db.js';
import { initializeDatabase } from './db/initDb.js';

const app = createApp();

async function bootstrap() {
  logger.info('Initializing FlowEM High-Throughput Bulk Email Platform (Pure MySQL 8)...');
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Test MySQL 8 database connectivity & run auto-initialization
  const isDbConnected = await checkDatabaseConnection();
  if (isDbConnected) {
    logger.info('MySQL 8 connection established successfully.');
    await initializeDatabase();
  } else {
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
      try {
        const pool = getDbPool();
        await pool.end();
      } catch (_) {}
      logger.info('MySQL 8 connection pool closed');
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

