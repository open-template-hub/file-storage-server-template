import { FileService } from '../interface/file-service.interface';
import S3 from 'aws-sdk/clients/s3';
import { File } from '../interface/file.interface';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'aws-sdk/global';

export class S3FileService implements FileService {
  constructor(private payload: any = null) {}

  /**
   * initializes client
   * @param providerConfig provider config
   */
  async initializeClient(providerConfig: any): Promise<S3> {
    const payload = providerConfig.payload;

    this.payload = payload;

    config.update({
      accessKeyId: payload.accessKeyId,
      secretAccessKey: payload.secretAccessKey,
      region: payload.region,
    });

    return new S3({
      apiVersion: payload.apiVersion,
    });
  }

  /**
   * uploads file
   * @param client service client
   * @param file file
   */
  async upload(client: S3, file: File): Promise<File> {
    file.external_file_id = uuidv4();
    const buf = Buffer.from(
      file.data.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    let res;
    try {
      res = await client
        .putObject({
          Body: buf,
          Key: file.external_file_id,
          Bucket: this.payload.bucketName,
          ContentType: file.content_type,
          ContentEncoding: 'base64',
        })
        .promise();
    } catch (err) {
      throw new Error(err.message);
    }

    file.uploaded = !res.$response.error;

    file.created_time = new Date();
    file.last_update_time = new Date();

    return file;
  }

  /**
   * downloads file
   * @param client service client
   * @param externalFileId external file id
   */
  async download(client: S3, externalFileId: string): Promise<any> {
    let res;
    try {
      res = await client
        .getObject({
          Key: externalFileId,
          Bucket: this.payload.bucketName,
        })
        .promise();
    } catch (err) {
      throw new Error(err.message);
    }

    return (res.$response.data as any).Body.toString('base64');
  }
}
