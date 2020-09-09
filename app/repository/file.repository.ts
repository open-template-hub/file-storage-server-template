/**
 * @description holds file dao postgre
 */

import { File } from "../models/file.model";
import { PostgreSqlProvider } from "../providers/postgre.provider";

export class FileRepository {
  constructor(private readonly provider: PostgreSqlProvider) { }

  saveFile = async(username: string, file: File, serviceKey: string) => {
    try {
      const result = await this.provider.query(
        'INSERT INTO files(username, service_key, content_type, title, description, external_file_id, created_time, last_update_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [username, serviceKey, file.content_type, file.title, file.description,
          file.external_file_id, file.created_time, file.last_update_time]);
      return result.rows[0].id;
    } catch (e) {
      throw e;
    }
  }

  getFile = async(username: string, id: number): Promise<File> => {
    let res = {} as any;
    try {
      res = await this.provider.query('SELECT * FROM files WHERE username = $1 and id = $2',
        [username, id]);
    } catch (e) {
      throw e;
    }
    return res.rows[0];
  }
}

