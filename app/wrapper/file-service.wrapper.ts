/**
 * @description holds file service wrapper
 */

import { FileServiceEnum } from '../enum/file-service.enum';
import { FileService } from '../interface/file-service.interface';
import { File } from '../interface/file.interface';
import { GoogleCloudFileService } from '../provider/google-cloud-file-service.provider';
import { S3FileService } from '../provider/s3-file-service.provider';

export class FileServiceWrapper implements FileService {
  fileService: FileService | undefined;

  constructor( uploadService: FileServiceEnum ) {
    if ( uploadService === FileServiceEnum.S3 ) {
      this.fileService = new S3FileService();
    } else if ( uploadService === FileServiceEnum.GCloud ) {
      this.fileService = new GoogleCloudFileService();
    } else {
      this.fileService = undefined;
    }
  }

  /**
   * initializes client
   * @param providerConfig provider config
   */
  initializeClient = async ( providerConfig: any ): Promise<any> => {
    if ( this.fileService === undefined ) {
      return null;
    }

    return this.fileService.initializeClient( providerConfig );
  };

  /**
   * uploads file
   * @param client client
   * @param file file
   */
  upload = async ( client: any, file: File ): Promise<File> => {
    if ( this.fileService === undefined ) {
      return file;
    }

    return this.fileService.upload( client, file );
  };

  /**
   * downloads file
   * @param client client
   * @param externalFileId external file id
   */
  download = async ( client: any, externalFileId: string ): Promise<any> => {
    if ( this.fileService === undefined ) {
      return null;
    }

    return this.fileService.download( client, externalFileId );
  };
}
