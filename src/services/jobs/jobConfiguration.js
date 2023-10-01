const Queue = require('bull');
const logger = require('../utils/logger');

const queueOpts = {
    redis: {
        port: process.env.REDIS_PORT ?? 6379,
        host: process.env.REDIS_HOST ?? '127.0.0.1',
    },
};

const defaultQueue = new Queue('defaultQueue', { ...queueOpts, db: 1 });
const mailQueue = new Queue('mailQueue', { ...queueOpts, db: 2 });
const notificationQueue = new Queue('notificationQueue', {
    ...queueOpts,
    db: 3,
});
const smsQueue = new Queue('smsQueue', { ...queueOpts, db: 4 });
const profilePercentQueue = new Queue('profilePercentQueue', {
    ...queueOpts,
    db: 5,
});

logger.info('bull-job-queue loaded 🍺🍻');

const handleFailure = async (job, err) => {
    if (job.attemptsMade >= job.opts.attempts) {
        logger.info(`🤯   Job failures above threshold ${job.name}`, err);
        job.remove();
        return null;
    }
    logger.info(
        `🤯   Job ${job.name} failed with ${err.message}. ${
            job.opts.attempts - job.attemptsMade
        } attempts left`,
    );
};

const handleCompleted = async (job) => {
    logger.info(
        `🌿   Job ${job.name} completed ${
            job?.data?.user?.email
                ? JSON.stringify(job?.data?.user?.email, null, 2)
                : ''
        }`,
    );
    job.remove();
};

const handleStalled = (job) => {
    logger.info(`🌿   Job ${job.name} stalled`);
};

const handleError = async (job) => {
    logger.info(`🌿   Job ${job.name} error occurred ${job}`);
};

defaultQueue.on('failed', handleFailure);
defaultQueue.on('completed', handleCompleted);
defaultQueue.on('stalled', handleStalled);

mailQueue.on('failed', handleFailure);
mailQueue.on('completed', handleCompleted);
mailQueue.on('stalled', handleStalled);

notificationQueue.on('failed', handleFailure);
notificationQueue.on('completed', handleCompleted);
notificationQueue.on('stalled', handleStalled);

smsQueue.on('failed', handleFailure);
smsQueue.on('completed', handleCompleted);
smsQueue.on('stalled', handleStalled);

profilePercentQueue.on('failed', handleFailure);
profilePercentQueue.on('completed', handleCompleted);
profilePercentQueue.on('stalled', handleStalled);

module.exports = {
    mailQueue,
    defaultQueue,
    notificationQueue,
    smsQueue,
    profilePercentQueue,
};
