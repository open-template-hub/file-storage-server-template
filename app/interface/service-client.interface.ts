/**
 * @description holds service client interface
 */

import { FileService } from './file-service.interface';

export interface ServiceClient {
  client: any;
  service: FileService;
  publicUrl: string;
}
