/**
 * @description holds file service wrapper
 */

import { FileService } from '../interface/file-service.interface';
import { S3FileService } from '../provider/s3-file-service.provider';
import { File } from '../interface/file.interface';
import { FileServiceEnum } from '../enum/file-service.enum';

export class FileServiceWrapper implements FileService {
  fileService: FileService | undefined;

  constructor(uploadService: FileServiceEnum) {
    if (uploadService === FileServiceEnum.S3) {
      this.fileService = new S3FileService();
    } else {
      this.fileService = undefined;
    }
  }

  /**
   * initializes client
   * @param providerConfig provider config
   */
  initializeClient = async (providerConfig: any): Promise<any> => {
    if (this.fileService === undefined) {
      return null;
    }

    return await this.fileService.initializeClient(providerConfig);
  };

  /**
   * uploads file
   * @param client client
   * @param file file
   */
  upload = async (client: any, file: File): Promise<File> => {
    if (this.fileService === undefined) {
      return file;
    }

    return await this.fileService.upload(client, file);
  };

  /**
   * downloads file
   * @param client client
   * @param externalFileId external file id
   */
  download = async (client: any, externalFileId: string): Promise<any> => {
    if (this.fileService === undefined) {
      return null;
    }

    return await this.fileService.download(client, externalFileId);
  };
}
