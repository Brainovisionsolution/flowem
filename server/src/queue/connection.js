import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

let redisConnection = null;
let redisAvailable = false;

// Only attempt Redis connection if explicitly enabled or in production with configured host
const shouldConnect = process.env.NODE_ENV === 'production' || process.env.ENABLE_REDIS === 'true';

if (shouldConnect) {
  try {
    redisConnection = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      enableOfflineQueue: false,
      connectTimeout: 2000,
      retryStrategy: () => null // Do not keep reconnecting if offline
    });

    redisConnection.on('connect', () => {
      redisAvailable = true;
      console.log(`[Queue] Redis connected successfully at ${redisHost}:${redisPort}`);
    });

    redisConnection.on('error', (err) => {
      redisAvailable = false;
      // Disconnect cleanly to prevent open sockets
      try { redisConnection.disconnect(); } catch (_) {}
    });

    redisConnection.connect().catch(() => {
      redisAvailable = false;
    });
  } catch (err) {
    redisAvailable = false;
  }
}

export function isRedisAvailable() {
  return redisAvailable && redisConnection && redisConnection.status === 'ready';
}

export function getRedisClient() {
  return redisAvailable ? redisConnection : null;
}

export const redisConfig = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null
};
