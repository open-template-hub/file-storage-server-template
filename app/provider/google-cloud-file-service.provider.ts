import { v4 as uuidv4 } from 'uuid';
import { FileService } from '../interface/file-service.interface';
import { File } from '../interface/file.interface';

class GoogleCloudPackage {
  static Storage: any;

  public static getInstance() {
    if ( !this.Storage ) {
      const { Storage } = require( '@google-cloud/storage' );
      this.Storage = Storage;
    }

    return {
      Storage: this.Storage,
    };
  }
}

export class GoogleCloudFileService implements FileService {

  payload: any = null;

  /**
   * initializes client
   * @param providerConfig provider config
   */
  async initializeClient( providerConfig: any ): Promise<any> {
    // Dynamically import gcloud sdks on initialize
    const gCloudPackage: any = GoogleCloudPackage.getInstance();
    const Storage: any = gCloudPackage.Storage;

    const payload = providerConfig.payload;

    this.payload = payload;

    return new Storage( {
      projectId: payload.projectId,
      credentials: {
        client_id: payload.clientId,
        client_email: payload.serviceAccount,
        private_key: payload.secretAccessKey,
      },
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
      const bucket = client.bucket( this.payload.bucketName );
      const blob = bucket.file( file.external_file_id );
      const blobStream = blob.createWriteStream();

      blobStream.end( buf );
    } catch ( err: any ) {
      throw new Error( err.message );
    }

    file.uploaded = true;

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
      const bucket = client.bucket( this.payload.bucketName );
      let file = bucket.file( externalFileId );
      res = await file.download();
    } catch ( err: any ) {
      throw new Error( err.message );
    }

    return res[ 0 ].toString( 'base64' );
  }
}
