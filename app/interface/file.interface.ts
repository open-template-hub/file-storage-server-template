/**
 * @description holds file interface
 */

import { Base64 } from 'aws-sdk/clients/ecr';
import { FileType } from '../enum/file-type.enum';

export interface File {
  id: number;
  title: string;
  description: string;
  external_file_id: string;
  created_time: Date;
  last_update_time: Date;
  data: Base64;
  content_type: string;
  uploaded: boolean;
  service_key: string;
  is_public: boolean;
  url: string;
  reporter: string;
  type: FileType;
}
