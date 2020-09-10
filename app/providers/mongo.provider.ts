/**
 * @description holds database connection provider
 */

import mongoose from 'mongoose';
import { Builder } from '../services/builder.service';
import { ServiceProviderRepository } from '../repository/service-provider.repository';

export class MongoDbProvider {
  // mongoose connection
  conn: mongoose.Connection | null = null;
  builder = new Builder();
  preloadDataTemplatePath = './assets/sql/preload.data.json';

  /**
   * creates database connection
   * @returns mongodb connection
   */
  preload = async () => {
    await this.initConnection();
    await this.loadInitialData();
  };

  initConnection = async () => {
    // connection uri
    const uri: string = process.env.MONGODB_URI as string;

    if (this.conn == null) {
      this.conn = await mongoose.createConnection(
        uri,
        {
          bufferCommands: false,
          bufferMaxEntries: 0,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false
        }
      );
    }
  }

  loadInitialData = async () => {
    if (this.conn == null) return;

    const data = this.builder.buildTemplate(this.preloadDataTemplatePath, null);

    if (data.length > 0) {
      const json = JSON.parse(data);
      const serviceProviderRepository = new ServiceProviderRepository(this.conn).getRepository();
      let serviceConfig: any = await serviceProviderRepository.findOne({ key: json.key });

      if (!serviceConfig) {
        await serviceProviderRepository.create(json);
      }
    }
  }
}
