import monitorRouter from './monitor.route';
import fileRouter from './file.route';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../services/error-handler.service';
import { EncryptionService } from '../services/encyrption.service';
import { preload } from '../services/preload.service';
import { MongoDbProvider } from '../providers/mongo.provider';
import { PostgreSqlProvider } from '../providers/postgre.provider';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  file: '/file'
}

export module Routes {
  const mongoDbProvider = new MongoDbProvider();
  const postgreSqlProvider = new PostgreSqlProvider();

  export const mount = (app: any) => {
    preload(mongoDbProvider, postgreSqlProvider).then(() => console.log('DB preloads are completed.'));

    const responseInterceptor = (_req: any, res: { send: () => void; }, next: () => void) => {
      let originalSend = res.send;
      const service = new EncryptionService();
      res.send = function () {
        console.time("Response Encryption Execution Time");
        const encrypted_arguments = service.encrypt(arguments);
        console.timeEnd("Response Encryption Execution Time");

        originalSend.apply(res, encrypted_arguments as any);
      };

      next();
    }

    // Use this interceptor before routes
    app.use(responseInterceptor);

    // Monitor router should be called before context creation
    app.use(subRoutes.monitor, monitorRouter);

    // INFO: Keep this method at top at all times
    app.all('/*', async (req: Request, res: Response, next: () => void) => {
      try {
        // create context
        res.locals.ctx = await context(req, mongoDbProvider, postgreSqlProvider);

        next();
      } catch (e) {
        let error = handle(e);
        res.status(error.code).json({ message: error.message });
      }
    });

    // INFO: Add your routes here
    app.use(subRoutes.file, fileRouter);

    // Use for error handling
    app.use(function (err: any, req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: any; }): void; new(): any; }; }; }, next: any) {
      let error = handle(err);
      console.log(err);
      res.status(error.code).json({ message: error.message });
    });

  }
}

