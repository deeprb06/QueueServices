import express from 'express';
import cors from 'cors';
import jobQueue from './src/services/bull-jobs/eachProcess';
import routes from './src/routes'
import config from './src/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(config.api.prefix, routes)
export default app;
