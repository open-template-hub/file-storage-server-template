import monitorRouter from './monitor.route';
import fileRouter from './file.route';
import { Request, Response } from 'express';
import { context } from '../context';
import { handle } from '../services/error-handler.service';
import { EncryptionService } from '../services/encyrption.service';
import { preload } from '../services/preload.service';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  file: '/file'
}

export module Routes {
  export const mount = (app: any) => {

    preload().then(() => console.log('DB preloads are completed.'));

    const responseInterceptor = (_req: any, res: { send: () => void; }, next: () => void) => {
      let originalSend = res.send;
      const service = new EncryptionService();
      res.send = function () {
        console.log("Starting Encryption: ", new Date());
        const encrypted_arguments = service.encrypt(arguments);
        console.log("Encryption Completed: ", new Date());

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
        res.locals.ctx = await context(req);

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

