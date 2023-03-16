import express from 'express';
import cors from 'cors';
import path from 'path';
import jobQueue from './src/services/bull-jobs/eachProcess';
import routes from './src/routes'
import config from './src/config';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import FilesystemBackend from 'i18next-node-fs-backend';
import logger from './src/helpers/utils/logger';

const app = express();

global.logger = logger;

i18next
.use(FilesystemBackend)
.use(i18nextMiddleware.LanguageDetector)
.init({
    lng: "en",
    ns: [
        "file",
            "specificMessage",
            "common"
        ],
        defaultNS: [
            "file",
            "specificMessage",
            "common"
        ],
        backend: {
            loadPath: path.join(__dirname, `/src/lang/{{lng}}/{{ns}}.json`),
            addPath: path.join(__dirname, `/src/lang/{{lng}}/{{ns}}.json`),
        },
        detection: {
            order: ["header", "querystring"/*, "cookie"*/],
            lookupHeader: "lng",
            caches: false,
        },
        fallbackLng: "en",
        preload: ["en"],
    })
app.use(i18nextMiddleware.handle(i18next));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(config.api.prefix, routes)
export default app;
