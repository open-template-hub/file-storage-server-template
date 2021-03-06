import { v4 as uuidv4 } from 'uuid';
import { FileService } from '../interface/file-service.interface';
import { File } from '../interface/file.interface';

class S3Package {
  static config: any;
  static S3: any;

  public static getInstance() {
    if ( !this.config && !this.S3 ) {
      const { config } = require( 'aws-sdk/global' );
      this.config = config;
      this.S3 = require( 'aws-sdk/clients/s3' );
      console.info( 'Initializing S3 Package. Config: ', this.config );
    }

    return {
      config: this.config,
      S3: this.S3,
    };
  }
}

export class S3FileService implements FileService {
  constructor( private payload: any = null ) {
  }

  /**
   * initializes client
   * @param providerConfig provider config
   */
  async initializeClient( providerConfig: any ): Promise<any> {
    // Dynamically import aws sdks on initialize
    const s3Package: any = S3Package.getInstance();
    const config: any = s3Package.config;
    const S3: any = s3Package.S3;

    const payload = providerConfig.payload;

    this.payload = payload;

    config.update( {
      accessKeyId: payload.accessKeyId,
      secretAccessKey: payload.secretAccessKey,
      region: payload.region,
    } );

    return new S3( {
      apiVersion: payload.apiVersion,
    } );
  }

  /**
   * uploads file
   * @param client service client
   * @param file file
   */
  async upload( client: any, file: File ): Promise<File> {
    file.external_file_id = uuidv4();
    const buf = Buffer.from(
        file.data.replace( /^data:image\/\w+;base64,/, '' ),
        'base64'
    );

    let res;
    try {
      res = await client
      .putObject( {
        Body: buf,
        Key: file.external_file_id,
        Bucket: this.payload.bucketName,
        ContentType: file.content_type,
        ContentEncoding: 'base64',
      } )
      .promise();
    } catch ( err ) {
      throw new Error( err.message );
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
  async download( client: any, externalFileId: string ): Promise<any> {
    let res;
    try {
      res = await client
      .getObject( {
        Key: externalFileId,
        Bucket: this.payload.bucketName,
      } )
      .promise();
    } catch ( err ) {
      throw new Error( err.message );
    }

    return ( res.$response.data as any ).Body.toString( 'base64' );
  }
}
