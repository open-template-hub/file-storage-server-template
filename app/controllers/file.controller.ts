/**
 * @description holds file controller
 */

import { ServiceProviderRepository } from "../repository/service-provider.repository";
import { FileServiceWrapper } from "../wrappers/file-service.wrapper";
import { File } from "../models/file.model";
import { Context } from "../models/context.model";
import { Connection } from "mongoose";
import { FileRepository } from "../repository/file.repository"
import { ServiceClient } from "../models/service-client.model";
import { MongoDbProvider } from "../providers/mongo.provider";

export class FileController {
  createFile = async (context: Context, file: File): Promise<any> => {
    if (!this.isValidFile(file)) throw new Error('File must contain contentType, title, description and data');

    const serviceClient = await this.getServiceClient(context.mongoDbProvider as MongoDbProvider, context.serviceKey);

    file = await serviceClient.service.upload(serviceClient.client, file);

    if (file.uploaded) {
      const fileRepository = new FileRepository(context.postgreSqlProvider);
      const id = await fileRepository.saveFile(context.username, file, context.serviceKey);
      return id;
    }

    throw new Error('File upload failed');
  }

  downloadFile = async (context: Context, id: any): Promise<File> => {
    const fileRepository = new FileRepository(context.postgreSqlProvider);

    const file = await fileRepository.getFile(context.username, id);

    if (file === undefined) {
      throw new Error("File not found with id: " + id);
    }

    const serviceClient = await this.getServiceClient(context.mongoDbProvider as MongoDbProvider, file.service_key);

    file.data = await serviceClient.service.download(serviceClient.client, file.external_file_id);

    return file;
  }

  private getServiceClient = async (provider: MongoDbProvider, serviceKey: string): Promise<ServiceClient> => {
    const serviceConfig = await this.getServiceConfig(provider, serviceKey);

    const service = new FileServiceWrapper(serviceConfig.payload.service)

    const client = await service.initializeClient(serviceConfig);

    if (client === undefined) throw new Error('Client is not initialized correctly');

    return { client, service } as ServiceClient;
  }

  private getServiceConfig = async (provider: MongoDbProvider, serviceKey: string): Promise<any> => {
    const conn = provider.getAvailableConnection();
    const serviceProviderRepository = await new ServiceProviderRepository().getRepository(conn);

    let serviceConfig: any = await serviceProviderRepository.findOne({ key: serviceKey });

    if (serviceConfig === null) throw new Error('Upload service can not be found');

    return serviceConfig;
  }

  private isValidFile = (file: File): boolean => {
    if (file.title && file.content_type && file.data && file.description && file) return true;
    return false;
  }
}

