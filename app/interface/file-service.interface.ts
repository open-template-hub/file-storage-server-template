/**
 * @description holds file service interface
 */

import { File } from './file.interface';

export interface FileService {
  /**
   * initializes file service
   * @param providerConfig provider config
   */
  initializeClient( providerConfig: any ): Promise<any>;

  /**
   * uploads file
   * @param client service client
   * @param file file
   */
  upload( client: any, file: File ): Promise<File>;

  /**
   * downloads file
   * @param client service client
   * @param externalFileId external file id
   */
  download( client: any, externalFileId: string ): Promise<any>;
}
