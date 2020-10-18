/**
 * @description holds context
 */

import { AuthService } from './services/auth.service';
import { MongoDbProvider } from './providers/mongo.provider';
import { Context } from './models/context.model';
import { PostgreSqlProvider } from './providers/postgre.provider';
import { TokenService } from './services/token.service';

export const context = async (req: any, mongoDbProvider: MongoDbProvider, postgreSqlProvider: PostgreSqlProvider) => {
  const tokenService = new TokenService();
  const authService = new AuthService(tokenService);

  const currentUser: any = await authService.getCurrentUser(req);

  const serviceKey = req.body.key;

  return { 
    mongoDbProvider, 
    postgreSqlProvider, 
    username: currentUser.username, 
    serviceKey 
  } as Context;
}
