import {
  context,
  DebugLogUtil,
  EncryptionUtil,
  ErrorHandlerUtil,
  MessageQueueProvider,
  MongoDbProvider,
  PostgreSqlProvider,
  PreloadUtil,
} from '@open-template-hub/common';
import { NextFunction, Request, Response } from 'express';
import { Environment } from '../../environment';
import { FileQueueConsumer } from '../consumer/file-queue.consumer';
import {
  router as fileRouter,
} from './file.route';
import {
  router as monitorRouter,
} from './monitor.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  file: '/file',
};

export namespace Routes {
  var mongodb_provider: MongoDbProvider;
  var environment: Environment;
  var postgresql_provider: PostgreSqlProvider;
  var message_queue_provider: MessageQueueProvider;
  let errorHandlerUtil: ErrorHandlerUtil;
  const debugLogUtil = new DebugLogUtil();

  function populateRoutes(mainRoute: string, routes: Array<string>) {
    var populated = Array<string>();
    for (const s of routes) {
      populated.push(mainRoute + (s === '/' ? '' : s));
    }

    return populated;
  }

  export const mount = (app: any) => {
    const preloadUtil = new PreloadUtil();
    environment = new Environment();
    errorHandlerUtil = new ErrorHandlerUtil( debugLogUtil, environment.args() );
    mongodb_provider = new MongoDbProvider(environment.args());
    postgresql_provider = new PostgreSqlProvider(
      environment.args(),
      'FileServer'
    );

    message_queue_provider = new MessageQueueProvider(environment.args());

    const channelTag = new Environment().args().mqArgs
      ?.fileServerMessageQueueChannel as string;
    message_queue_provider.getChannel(channelTag).then((channel: any) => {
      const fileQueueConsumer = new FileQueueConsumer(channel);
      message_queue_provider.consume(
        channel,
        channelTag,
        fileQueueConsumer.onMessage,
        1
      );
    });

    preloadUtil
      .preload(mongodb_provider, postgresql_provider)
      .then(() => console.log('DB preloads are completed.'));

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
