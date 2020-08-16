/**
 * @description holds file dao postgre
 */

import { File } from "../models/file.model";
import { PostgreSqlProvider } from "../providers/postgre.provider";

export class FileRepository {
  constructor(private readonly provider: PostgreSqlProvider) { }

  saveFile = async(username: string, file: File, serviceKey: string) => {
    try {
      await this.provider.query(
        'INSERT INTO files(username, service_key, content_type, title, description, external_file_id, created_time, last_update_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [username, serviceKey, file.contentType, file.title, file.description,
          file.externalFileId, file.createdTime, file.lastUpdateTime]);
    } catch (e) {
      throw e;
    }
  }

  getFile = async(username: string, serviceKey: string, externalFileId: string): Promise<File> => {
    let res = {} as any;
    try {
      res = await this.provider.query('SELECT * FROM files WHERE username = $1 and service_key = $2 and external_file_id = $3',
        [username, serviceKey, externalFileId]);
    } catch (e) {
      throw e;
    }
    return res.rows[0];
  }
}

