/**
 * @description holds file controller
 */

import { ServiceProviderRepository } from '../repository/service-provider.repository';
import { FileServiceWrapper } from '../wrapper/file-service.wrapper';
import { File } from '../interface/file.interface';
import { Context, MongoDbProvider } from '@open-template-hub/common';
import { FileRepository } from '../repository/file.repository';
import { ServiceClient } from '../interface/service-client.interface';

export class FileController {
  /**
   * creates file
   * @param context context
   * @param file file
   */
  createFile = async (context: Context, file: File): Promise<any> => {
    if (!this.isValidFile(file))
      throw new Error(
        'File must contain contentType, title, description and data'
      );

    const serviceClient = await this.getServiceClient(
      context.mongodb_provider,
      context.serviceKey
    );

    file = await serviceClient.service.upload(serviceClient.client, file);

    if (file.uploaded) {
      const fileRepository = new FileRepository(context.postgresql_provider);
      return await fileRepository.saveFile(
        context.username,
        file,
        context.serviceKey
      );
    }

    throw new Error('File upload failed');
  };

  /**
   * gets file by id
   * @param context context
   * @param id file id
   */
  downloadFile = async (context: Context, id: any): Promise<File> => {
    const fileRepository = new FileRepository(context.postgresql_provider);

    const file = await fileRepository.getFile(context.username, id);

    if (file === undefined) {
      throw new Error('File not found with id: ' + id);
    }

    const serviceClient = await this.getServiceClient(
      context.mongodb_provider,
      file.service_key
    );

    file.data = await serviceClient.service.download(
      serviceClient.client,
      file.external_file_id
    );

    return file;
  };

  /**
   * gets service client
   * @param provider service provider
   * @param serviceKey service key
   */
  private getServiceClient = async (
    provider: MongoDbProvider,
    serviceKey: string
  ): Promise<ServiceClient> => {
    const serviceConfig = await this.getServiceConfig(provider, serviceKey);

    const service = new FileServiceWrapper(serviceConfig.payload.service);

    const client = await service.initializeClient(serviceConfig);

    if (client === undefined)
      throw new Error('Client is not initialized correctly');

    return { client, service } as ServiceClient;
  };

  /**
   * gets service config
   * @param provider service provider
   * @param serviceKey service key
   */
  private getServiceConfig = async (
    provider: MongoDbProvider,
    serviceKey: string
  ): Promise<any> => {
    const conn = provider.getConnection();

    const serviceProviderRepository = await new ServiceProviderRepository().initialize(
      conn
    );

    let serviceConfig: any = await serviceProviderRepository.getServiceProviderByKey(
      serviceKey
    );

    if (serviceConfig === null)
      throw new Error('Upload service can not be found');

    return serviceConfig;
  };

  /**
   * checks is file valid
   * @param file file
   */
  private isValidFile = (file: File): boolean => {
    if (
      file.title &&
      file.content_type &&
      file.data &&
      file.description &&
      file
    ) {
      return true;
    }
    return false;
  };
}
