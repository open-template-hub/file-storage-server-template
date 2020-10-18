/**
 * @description holds provider model
 */

import mongoose from 'mongoose';

export class ServiceProviderRepository {
  private readonly collectionName: string = 'service-provider';

  private productSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      key: { type: String, unique: true, required: true, dropDups: true },
      description: { type: String, required: true },
      payload: { type: Object }
    };

    this.productSchema = new mongoose.Schema(schema);
  }

  /**
   * creates provider model
   * @returns provider model
   */
  getRepository = async(conn: mongoose.Connection) => {
    return conn.model(this.collectionName, this.productSchema, this.collectionName);
  }
}


