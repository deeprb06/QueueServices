const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');
const config = require('./src/config');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const FilesystemBackend = require('i18next-node-fs-backend');
const logger = require('./src/utils/logger');
const catchAsync = require('./src/utils/catchAsync');
const { localize, toTitleCase, randomString } = require('./src/utils/helper');
const util = require('./src/utils/messages');
const queuesRouter = require('./src/services/jobs');
const app = express();
require('./src/services/jobs/process');
const { store } = require('./src/seeder/store-routes');
const descriptor = require('express-list-endpoints-descriptor')(express);

global.logger = logger;
global.catchAsync = catchAsync;
global._localize = localize;
global._toTitleCase = toTitleCase;
global._randomString = randomString;
global.util = util;

i18next
    .use(FilesystemBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        lng: 'en',
        ns: ['file', 'specificMessage', 'common'],
        defaultNS: ['file', 'specificMessage', 'common'],
        backend: {
            loadPath: path.join(
                __dirname,
                `/resources/lang/{{lng}}/{{ns}}.json`,
            ),
            addPath: path.join(__dirname, `/src/lang/{{lng}}/{{ns}}.json`),
        },
        detection: {
            order: ['header', 'querystring' /*, "cookie"*/],
            lookupHeader: 'lng',
            caches: false,
        },
        fallbackLng: 'en',
        preload: ['en'],
    });

app.use(i18nextMiddleware.handle(i18next));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/queues', queuesRouter);

app.use(config.api.prefix, routes);

store(descriptor.listEndpoints(app));
if (parseInt(config.SEED)) {
    initSeed().then(() => logger.info('seeded successfully'));
}
module.exports = app;
