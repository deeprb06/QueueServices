const Agenda = require('agenda');
const { MONGODB } = require('./');

const dbConfigure = `${MONGODB.DB_USERNAME}${MONGODB.DB_PASSWORD}`;
const dbConnection = `${MONGODB.DB_CONNECTION}://${dbConfigure}${MONGODB.DB_HOST}${MONGODB.DB_PORT}/${MONGODB.DB_DATABASE}`;

const agenda = new Agenda({
    db: { address: dbConnection, collection: 'crons' },
});

module.exports = agenda;
