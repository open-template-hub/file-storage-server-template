import {
  router as monitorRouter,
  publicRoutes as monitorPublicRoutes,
} from './monitor.route';
import {
  router as fileRouter,
  publicRoutes as filePublicRoutes,
} from './file.route';
import { NextFunction, Request, Response } from 'express';
import { context } from '@open-template-hub/common';
import { ErrorHandlerUtil } from '@open-template-hub/common';
import { EncryptionUtil } from '@open-template-hub/common';
import { PreloadUtil } from '@open-template-hub/common';
import { PostgreSqlProvider } from '@open-template-hub/common';
import { MongoDbProvider } from '@open-template-hub/common';
import { DebugLogUtil } from '@open-template-hub/common';
import { Environment } from '../../environment';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  file: '/file',
};

export module Routes {
  var mongodb_provider: MongoDbProvider;
  var environment: Environment;
  var postgresql_provider: PostgreSqlProvider;
  const errorHandlerUtil = new ErrorHandlerUtil();
  const debugLogUtil = new DebugLogUtil();
  var publicRoutes: string[] = [];
  var adminRoutes: string[] = [];

  function populateRoutes(mainRoute: string, routes: Array<string>) {
    var populated = Array<string>();
    for (var i = 0; i < routes.length; i++) {
      const s = routes[i];
      populated.push(mainRoute + (s === '/' ? '' : s));
    }

    return populated;
  }

  export const mount = (app: any) => {
    const preloadUtil = new PreloadUtil();
    environment = new Environment();
    mongodb_provider = new MongoDbProvider(environment.args());
    postgresql_provider = new PostgreSqlProvider(
      environment.args(),
      'FileServer'
    );

    preloadUtil
      .preload(mongodb_provider, postgresql_provider)
      .then(() => console.log('DB preloads are completed.'));

    publicRoutes = [
      ...populateRoutes(subRoutes.monitor, monitorPublicRoutes),
      ...populateRoutes(subRoutes.file, filePublicRoutes),
    ];
    console.log('Public Routes: ', publicRoutes);

    const responseInterceptor = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      let originalSend = res.send;
      const encryptionUtil = new EncryptionUtil(environment.args());
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
          environment.args(),
          publicRoutes,
          adminRoutes,
          mongodb_provider,
          postgresql_provider
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
