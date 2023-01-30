import bullQueue from 'bull';
import config from '../../config';

const emailRedisOptions = {
  redis: {
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    db: 1,
  },
};

const notificationRedisOptions = {
  redis: {
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    db: 2,
  },
};

export const emailQueue = new bullQueue('emailQueue', emailRedisOptions);
export const notificationQueue = new bullQueue('notificationQueue', notificationRedisOptions);

console.info('Bull Queue Loaded! ⌛✔️ ');

// Function that handles job failure.
const handleFailure = (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    console.info(`🤯 Job ${job.name} failures above threshold. Error: `, err);
    // job.remove();
    return null;
  }
  console.info(
    `🤯 Job ${job.name} failed with ${err.message}. ${
      job.opts.attempts - job.attemptsMade
    } attempts left.`,
  );
};

// Function that handles job completion.
const handleCompleted = (job) => {
  console.info(`🌿 Job ${job.name} completed.`);
  job.remove();
};

// Function that handles stalled job.
const handleStalled = (job) => {
  console.info(`🌿 Job ${job.name} stalled.`);
};

// bull-queue Events listeners
emailQueue.on('stalled', handleStalled);
emailQueue.on('completed', handleCompleted);
emailQueue.on('failed', handleFailure);

notificationQueue.on('stalled', handleStalled);
notificationQueue.on('completed', handleCompleted);
notificationQueue.on('failed', handleFailure);
