/**
 * @description holds file dao postgre
 */

import { PostgreSqlProvider } from '@open-template-hub/common';
import { File } from '../interface/file.interface';

export class FileRepository {
  constructor( private readonly provider: PostgreSqlProvider ) {
  }

  /**
   * saves file info
   * @param username username
   * @param file file
   * @param serviceKey service key
   */
  saveFile = async ( username: string, file: File, serviceKey: string ) => {
    const result = await this.provider.query(
        'INSERT INTO files(username, service_key, content_type, title, description, external_file_id, created_time, last_update_time, is_public, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [
          username,
          serviceKey,
          file.content_type,
          file.title,
          file.description,
          file.external_file_id,
          file.created_time,
          file.last_update_time,
          file.is_public,
          file.type
        ]
    );
    return result.rows[ 0 ].id;
  };

  /**
   * gets file
   * @param username username
   * @param id id
   */
  getFile = async ( username: string, id: number ): Promise<File> => {
    let res = await this.provider.query(
        'SELECT * FROM files WHERE (username = $1 or is_public = true) and id = $2',
        [ username, id ]
    );
    return res.rows[ 0 ];
  };
}
