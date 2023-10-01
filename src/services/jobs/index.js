const {
   defaultQueue,
   mailQueue,
   notificationQueue,
   smsQueue,
   profilePercentQueue
} = require('./jobConfiguration');
const { JOB_TYPE } = require('../../config/constants/common');
const { createBullBoard } = require('bull-board');
const { BullAdapter } = require('bull-board/bullAdapter');
const { router } = createBullBoard([
   new BullAdapter(defaultQueue),
   new BullAdapter(mailQueue),
   new BullAdapter(notificationQueue),
   new BullAdapter(smsQueue),
]);

const createJob = async (name, data, options = {}) => {
   const opts = { priority: 0, attempts: 2, delay: 1000 };

   // map queue with job name
   const queueMapping = {
      [JOB_TYPE.SEND_MAIL]: mailQueue,
      [JOB_TYPE.SEND_NOTIFICATION]: notificationQueue,
      [JOB_TYPE.REF_DATA_UPDATION]: defaultQueue,
      [JOB_TYPE.REF_DATA_DELETION]: defaultQueue,
      [JOB_TYPE.SEND_SMS]: smsQueue,
      [JOB_TYPE.MIGRATE_PROFILE_PERCENT]: profilePercentQueue
   };

   const targetQueue = queueMapping[name] || defaultQueue;
   // add job in queue
   targetQueue.add(name, data, {
      ...options,
      priority: options.priority || opts.priority,
      attempts: options.attempts || opts.attempts,
      delay: options.delay || opts.delay,
      removeOnComplete: true,
      removeOnFail: false,
   });
};

//createJob("demoJob",{name:"sendMail"},{}); use this fn where you want to create new job

module.exports = { createJob, queuesRouter: router };
