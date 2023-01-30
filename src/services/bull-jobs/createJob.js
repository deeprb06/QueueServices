import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/express';
import { ExpressAdapter } from '@bull-board/express';
import { emailQueue, notificationQueue } from './jobConfig';
import config from '../../config';

// create a job

export const createJobQueue = async (jobName, dataObj, opts = {}) => {
   const defaultOpts = {
      priority: 0,
      attempts: 3,
      delay: 2000,
      removeOnComplete: false,
      removeOnFail: false,
   };

    const QueueName = jobName === config.JOB_NAME.SENDMAIL ? emailQueue : notificationQueue;
    QueueName.add(jobName, dataObj, Object.keys(opts).length > 0 ? opts : defaultOpts);
};

// To check all jobs in bull-board UI.
export const myServerAdapter = new ExpressAdapter();
myServerAdapter.setBasePath('/queue');

createBullBoard({ queues: [ new BullAdapter(emailQueue), new BullAdapter(notificationQueue)], serverAdapter: myServerAdapter });
