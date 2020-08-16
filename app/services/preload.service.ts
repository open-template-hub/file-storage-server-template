import { MongoDbProvider } from "../providers/mongo.provider";
import { PostgreSqlProvider } from "../providers/postgre.provider";

export const preload = async () => {
  const mongoDbProvider = new MongoDbProvider();
  const postgreSqlProvider = new PostgreSqlProvider();
  
  mongoDbProvider.preload();
  postgreSqlProvider.preload();
}
