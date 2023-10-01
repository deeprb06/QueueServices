const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 50;
const {
    mailQueue,
    defaultQueue,
    notificationQueue,
    smsQueue,
} = require('./jobConfiguration');
const Jobs = require('./jobs');

for (let identity in Jobs._processors) {
    defaultQueue.process(identity, 1, Jobs._processors[identity]);
    mailQueue.process(identity, 5, Jobs._processors[identity]);
    notificationQueue.process(identity, 5, Jobs._processors[identity]);
    smsQueue.process(identity, 5, Jobs._processors[identity]);
}
