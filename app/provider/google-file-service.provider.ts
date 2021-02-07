import { Bucket, BucketOptions, Storage } from '@google-cloud/storage';
import { FileService } from '../interface/file-service.interface';
import { File } from '../interface/file.interface';
import { v4 as uuidv4 } from 'uuid';

class GoogleStoragePackage {
  static bucket: Bucket;

  public static getInstance(payload: any) {
    if (!this.bucket) {
      const storage = new Storage({ apiEndpoint: payload.apiEndpoint });
      this.bucket = (storage as Storage).bucket(payload.bucketName, {
        kmsKeyName: payload.kmsKeyName,
        userProject: payload.userProject,
      } as BucketOptions);

      console.info('Initializing Google Bucket. Name: ', payload.bucketName);
    }

    return {
      bucket: this.bucket,
    };
  }
}

export class GoogleFileService implements FileService {
  constructor(private payload: any = null) {}

  /**
   * initializes client
   * @param providerConfig provider config
   */
  async initializeClient(providerConfig: any): Promise<any> {
    const payload = providerConfig.payload;

    this.payload = payload;

    const google = GoogleStoragePackage.getInstance(payload);

    return google.bucket;
  }

  /**
   * uploads file
   * @param client service client
   * @param file file
   */
  async upload(client: any, file: File): Promise<File> {
    file.external_file_id = uuidv4();
    const buf = Buffer.from(
      file.data.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    try {
      const req = (client as Bucket).file(file.external_file_id);

      await req.save(buf);
    } catch (err) {
      throw new Error(err.message);
    }

    file.uploaded = true;

    file.created_time = new Date();
    file.last_update_time = new Date();

    return file;
  }

  base64MimeType = (encoded: any): string | null => {
    var result = null;

    if (typeof encoded !== 'string') {
      return result;
    }

    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  };

  /**
   * downloads file
   * @param client service client
   * @param externalFileId external file id
   */
  async download(client: any, externalFileId: string): Promise<any> {
    let res;
    try {
      const req = (client as Bucket).file(externalFileId);

      res = await req.get();
    } catch (err) {
      throw new Error(err.message);
    }

    return (res[0] as any).Body.toString('base64');
  }
}
