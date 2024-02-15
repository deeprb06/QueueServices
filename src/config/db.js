const mongoose = require('mongoose');
const { MONGODB } = require('./config');
const dbConfigure = `${MONGODB.DB_USERNAME}${MONGODB.DB_PASSWORD}`;
const dConnection = `${MONGODB.DB_CONNECTION}://${dbConfigure}${MONGODB.DB_HOST}${MONGODB.DB_PORT}/${MONGODB.DB_DATABASE}`;

mongoose.connect(dConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// TODO: Remove debug in production

mongoose.set('debug', false);
let db = mongoose.connection;

db.once('open', () => {
    logger.info('Connection Succeed');
});

db.on('error', () => {
    logger.info('Error in Connect Mongo');
});

module.exports = mongoose;
