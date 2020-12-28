import {
  router as monitorRouter,
  publicRoutes as monitorPublicRoutes,
} from './monitor.route';
import {
  router as fileRouter,
  publicRoutes as filePublicRoutes,
} from './file.route';
import { NextFunction, Request, Response } from 'express';
import { context } from '../context';
import { ErrorHandlerUtil } from '../util/error-handler.util';
import { EncryptionUtil } from '../util/encryption.util';
import { PreloadUtil } from '../util/preload.util';
import { PostgreSqlProvider } from '../provider/postgre.provider';
import { MongoDbProvider } from '../provider/mongo.provider';
import { DebugLogUtil } from '../util/debug-log.util';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  file: '/file',
};

const publicRoutes: string[] = [];
var adminRoutes: string[] = [];

export module Routes {
  const mongoDbProvider = new MongoDbProvider();
  const postgreSqlProvider = new PostgreSqlProvider();
  const errorHandlerUtil = new ErrorHandlerUtil();
  const debugLogUtil = new DebugLogUtil();

  export const mount = (app: any) => {
    const preloadUtil = new PreloadUtil();

    preloadUtil
      .preload(mongoDbProvider, postgreSqlProvider)
      .then(() => console.log('DB preloads are completed.'));

    for (const route of monitorPublicRoutes) {
      publicRoutes.push(subRoutes.monitor + route);
    }

    for (const route of filePublicRoutes) {
      publicRoutes.push(subRoutes.file + route);
    }

    const responseInterceptor = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      let originalSend = res.send;
      const encryptionUtil = new EncryptionUtil();
      res.send = function () {
        debugLogUtil.log('Starting Encryption: ', new Date());
        const encrypted_arguments = encryptionUtil.encrypt(arguments);
        debugLogUtil.log('Encryption Completed: ', new Date());

        originalSend.apply(res, encrypted_arguments as any);
      } as any;

      next();
    };

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next: NextFunction) => {
      try {
        // create context
        res.locals.ctx = await context(
          req,
          mongoDbProvider,
          postgreSqlProvider,
          publicRoutes,
          adminRoutes
        );

        next();
      } catch (err) {
        let error = errorHandlerUtil.handle(err);
        res.status(error.code).json({ message: error.message });
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.monitor, monitorRouter);
    app.use(subRoutes.file, fileRouter);

    // Use for error handling
    app.use(function (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      let error = errorHandlerUtil.handle(err);
      res.status(error.code).json({ message: error.message });
    });
  };
}
