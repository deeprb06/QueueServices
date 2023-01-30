const EventEmitter = require('events');
const { _processors } = require('../bull-jobs/processors');
const { emailQueue, notificationQueue } = require('./jobConfig');
EventEmitter.defaultMaxListeners = 50;

for(let identity in _processors) {
    emailQueue.process(identity, 1, _processors[identity]);
    notificationQueue.process(identity, 1, _processors[identity]);
}



