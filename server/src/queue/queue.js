import { Queue, Worker } from 'bullmq';
import { isRedisAvailable, getRedisClient } from './connection.js';
import { processEmailRecipient } from './workers/emailProcessor.js';

const QUEUE_NAME = 'flowem-email-queue';

let bullQueue = null;
let bullWorker = null;

// Asynchronous in-process fallback queue when Redis is offline in local dev
class MemoryQueueRunner {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.rateLimitMs = 70; // ~14 emails/sec
  }

  push(job) {
    this.queue.push(job);
    this.drain();
  }

  pushBulk(jobs) {
    this.queue.push(...jobs);
    this.drain();
  }

  async drain() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      try {
        await processEmailRecipient(job.data);
      } catch (err) {
        console.error(`[Queue Fallback] Job execution error for ${job.data?.email}:`, err.message);
      }
      // SES rate limiter delay
      await new Promise((r) => setTimeout(r, this.rateLimitMs));
    }

    this.processing = false;
  }
}

const memoryQueue = new MemoryQueueRunner();

// Initialize BullMQ only when Redis is confirmed connected
function initBullMqIfAvailable() {
  const redis = getRedisClient();
  if (!bullQueue && redis && isRedisAvailable()) {
    try {
      bullQueue = new Queue(QUEUE_NAME, {
        connection: redis,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1500
          },
          removeOnComplete: 2000,
          removeOnFail: 5000
        }
      });

      bullWorker = new Worker(
        QUEUE_NAME,
        async (job) => {
          return processEmailRecipient(job.data);
        },
        {
          connection: redis,
          concurrency: 5,
          limiter: {
            max: 14,
            duration: 1000 // 14 emails / second
          }
        }
      );

      bullWorker.on('failed', (job, err) => {
        console.error(`[BullMQ Worker] Job ${job?.id} failed:`, err?.message);
      });
    } catch (err) {
      bullQueue = null;
      bullWorker = null;
    }
  }
}

export const queueService = {
  async addEmailJob(name, data, opts = {}) {
    initBullMqIfAvailable();
    if (isRedisAvailable() && bullQueue) {
      return bullQueue.add(name, data, opts);
    }
    // Safe asynchronous memory queue fallback
    memoryQueue.push({ name, data });
    return { id: `mem-${Date.now()}-${Math.random().toString(36).substring(7)}`, data };
  },

  async addBulkEmailJobs(jobs) {
    initBullMqIfAvailable();
    if (isRedisAvailable() && bullQueue) {
      const bullJobs = jobs.map(j => ({
        name: j.name || 'transmit-email',
        data: j.data,
        opts: j.opts || {}
      }));
      return bullQueue.addBulk(bullJobs);
    }
    // Safe asynchronous memory queue fallback
    memoryQueue.pushBulk(jobs);
    return jobs.map((j, idx) => ({ id: `mem-bulk-${Date.now()}-${idx}`, data: j.data }));
  },

  isBullMqActive() {
    return Boolean(isRedisAvailable() && bullQueue);
  }
};
