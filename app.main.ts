/**
 * @description holds server main
 */
import dotenv from 'dotenv'
import cors from 'cors';
import { Routes } from './app/routes/index.route';
import express = require('express');
import { preload } from './app/services/preload.service';

dotenv.config();

preload();

const app: express.Application = express();

// parse application/json
app.use(express.json({limit: '50mb'}))
app.use(cors());

Routes.mount(app);

const port: string = process.env.PORT || '3000' as string;

app.listen(port, () => {
 console.log('Node app is running on port', port);
});
