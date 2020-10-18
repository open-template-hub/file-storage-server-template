/**
 * @description holds database connection provider
 */

import mongoose, { Connection } from 'mongoose';
import { Builder } from '../services/builder.service';
import { ServiceProviderRepository } from '../repository/service-provider.repository';

export class MongoDbProvider {
  // mongoose connection
  private connectionPool: Array<Connection>;
  private currentPoolIndex: number;
  private builder: Builder;
  private currentPoolLimit: number;
  private readonly preloadDataTemplatePath = './assets/sql/preload.data.json';

  constructor() {
    this.currentPoolIndex = 0;
    this.connectionPool = new Array<Connection>();
    this.builder = new Builder();
    this.currentPoolLimit = parseInt(<string>process.env.MONGODB_CONNECTION_LIMIT) || 20 as number;
  }

  /**
   * creates database connection
   * @returns mongodb connection
   */
  preload = async () => {
    await this.createConnectionPool();
    await this.loadInitialData();
  };

  createConnectionPool = async () => {
    // close open connections
    for(let i = 0; i < mongoose.connections.length; i++) {
      let conn = mongoose.connections[i];

      if (conn) {
        conn.close();
        console.log("MongoDB Closed Connection: ", conn);
      } 
    }

    // create connection pool
    const uri: string = process.env.MONGODB_URI as string;
    for (let i = 0; i < this.currentPoolLimit; i++) {
      var conn = await mongoose.createConnection(
        uri,
        {
          bufferCommands: false,
          bufferMaxEntries: 0,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false
        }
      ).catch(error => { throw error});
      this.connectionPool.push(conn);
    }
  }

  getAvailableConnection = () => {
    if (this.currentPoolIndex === this.currentPoolLimit) {
      this.currentPoolIndex = 0;
    }

    console.log("MongoDB Current Pool Index: ", this.currentPoolIndex);
    return this.connectionPool[this.currentPoolIndex++];
  }

  loadInitialData = async () => {
    const data = this.builder.buildTemplate(this.preloadDataTemplatePath, null);

    if (data.length > 0) {
      const json = JSON.parse(data);
      const conn = this.getAvailableConnection();
      const serviceProviderRepository = await new ServiceProviderRepository().getRepository(conn);
      let serviceConfig: any = await serviceProviderRepository.findOne({ key: json.key });

      if (!serviceConfig) {
        await serviceProviderRepository.create(json);
      }
    }
  }
}
