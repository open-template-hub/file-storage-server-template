/**
 * @description holds context
 */

import { AuthService } from './services/auth.service';
import { MongoDbProvider } from './providers/mongo.provider';
import { Context } from './models/context.model';
import { PostgreSqlProvider } from './providers/postgre.provider';
import { TokenService } from './services/token.service';

export const context = async (req: any, mongoDbProvider: MongoDbProvider, postgreSqlProvider: PostgreSqlProvider, publicPaths: string[]) => {
 const tokenService = new TokenService();
 const authService = new AuthService(tokenService);

 let currentUser: any;
 let publicPath = false;

 for (const path of publicPaths) {
  if (req.path.startsWith(path)) {
   publicPath = true;
   break;
  }
 }

 if (!publicPath) {
  currentUser = await authService.getCurrentUser(req);
 }

 const serviceKey = req.body.key;

 return {
  mongoDbProvider,
  postgreSqlProvider,
  username: currentUser ? currentUser.username : '',
  serviceKey
 } as Context;
}
