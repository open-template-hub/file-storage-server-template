import {
  ContextArgs,
  MountArgs,
  MountAssets,
  Route,
  RouteArgs,
  mount as mountApp,
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { FileQueueConsumer } from '../consumer/file-queue.consumer';
import { router as fileRouter } from './file.route';
import { router as monitorRouter } from './monitor.route';

const subRoutes = {
  root: '/',
  monitor: '/monitor',
  file: '/file',
};

export namespace Routes {
  export const mount = (app: any) => {
    const envArgs = new Environment().args();

    const ctxArgs = {
      envArgs,
      providerAvailability: {
        mongo_enabled: true,
        postgre_enabled: true,
        mq_enabled: true,
      },
    } as ContextArgs;

    const assets = {
      mqChannelTag: envArgs.mqArgs?.fileServerMessageQueueChannel as string,
      queueConsumer: new FileQueueConsumer(),
      applicationName: 'FileServer',
    } as MountAssets;

    var routes: Array<Route> = [];

    routes.push({ name: subRoutes.monitor, router: monitorRouter });
    routes.push({ name: subRoutes.file, router: fileRouter });

    const routeArgs = { routes } as RouteArgs;

    const args = {
      app,
      ctxArgs,
      routeArgs,
      assets,
    } as MountArgs;

    mountApp(args);
  };
}
