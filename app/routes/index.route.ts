import { router as monitorRouter, publicRoutes as monitorPublicRoutes } from './monitor.route';
import { router as fileRouter, publicRoutes as filePublicRoutes } from './file.route';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../services/error-handler.service';
import { EncryptionService } from '../services/encyrption.service';
import { preload } from '../services/preload.service';
import { PostgreSqlProvider } from '../providers/postgre.provider';
import { MongoDbProvider } from '../providers/mongo.provider';

// debug logger
const debugLog = require('debug')('file-server:' + __filename.slice(__dirname.length + 1));

const subRoutes = {
 root: '/',
 monitor: '/monitor',
 file: '/file'
}

const publicRoutes: string[] = [];

export module Routes {
 const mongoDbProvider = new MongoDbProvider();
 const postgreSqlProvider = new PostgreSqlProvider();

 export const mount = (app: any) => {
  preload(mongoDbProvider, postgreSqlProvider).then(() => console.log('DB preloads are completed.'));

  for (const route of monitorPublicRoutes) {
   publicRoutes.push(subRoutes.monitor + route);
  }

  for (const route of filePublicRoutes) {
   publicRoutes.push(subRoutes.file + route);
  }

  const responseInterceptor = (_req: any, res: { send: () => void; }, next: () => void) => {
   let originalSend = res.send;
   const service = new EncryptionService();
   res.send = function () {
    debugLog("Starting Encryption: ", new Date());
    const encrypted_arguments = service.encrypt(arguments);
    debugLog("Encryption Completed: ", new Date());

    originalSend.apply(res, encrypted_arguments as any);
   };

   next();
  }

  // Use this interceptor before routes
  app.use(responseInterceptor);

  // INFO: Keep this method at top at all times
  app.all('/*', async (req: Request, res: Response, next: () => void) => {
   try {
    // create context
    res.locals.ctx = await context(req, mongoDbProvider, postgreSqlProvider, publicRoutes);

    next();
   } catch (err) {
    let error = handle(err);
    res.status(error.code).json({message: error.message});
   }
  });

  // INFO: Add your routes here
  app.use(subRoutes.monitor, monitorRouter);
  app.use(subRoutes.file, fileRouter);

  // Use for error handling
  app.use(function (err: any, req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: any; }): void; new(): any; }; }; }, next: any) {
   let error = handle(err);
   res.status(error.code).json({message: error.message});
  });

 }
}
