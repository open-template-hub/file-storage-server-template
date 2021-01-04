/**
 * @description holds server main
 */
import dotenv from 'dotenv';
import cors from 'cors';
import { Routes } from './app/route/index.route';
import express from 'express';
import { DebugLogUtil, UsageUtil } from '@open-template-hub/common';

const debugLogUtil = new DebugLogUtil();

// use .env file
const env = dotenv.config();
debugLogUtil.log(env.parsed);

// express init
const app: express.Application = express();

// public files
app.use(express.static('public'));

// parse application/json
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// mount routes
Routes.mount(app);

// listen port
const port: string = process.env.PORT || ('4004' as string);
app.listen(port, () => {
  console.info('File Storage Server is running on port: ', port);

  const usageUtil = new UsageUtil();
  const memoryUsage = usageUtil.getMemoryUsage();
  console.info(`Startup Memory Usage: ${memoryUsage.toFixed(2)} MB`);
});
