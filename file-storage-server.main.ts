/**
 * @description holds server main
 */
import dotenv from 'dotenv'
import cors from 'cors';
import { Routes } from './app/routes/index.route';
import express = require('express');

// use .env file
const env = dotenv.config();
console.log(env.parsed);

// express init
const app: express.Application = express();

// parse application/json
app.use(express.json({limit: '50mb'}))
app.use(cors());

// mount routes
Routes.mount(app);

// listen port
const port: string = process.env.PORT || '4004' as string;
app.listen(port, () => {
 console.log('File Storage Server is running on port', port);
});
