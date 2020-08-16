import { FileService } from "../models/file-service.model";
import AWS from 'aws-sdk';
import { File } from "../models/file.model";
import { v4 as uuidv4 } from 'uuid';

export class S3FileService implements FileService {
  payload: any;

  async initializeClient(providerConfig: any): Promise<AWS.S3> {
    const payload = providerConfig.payload;

    this.payload = payload;

    AWS.config.update({
      accessKeyId: payload.accessKeyId,
      secretAccessKey: payload.secretAccessKey,
      region: payload.region
    }); 

    return new AWS.S3({
      apiVersion: payload.apiVersion
    });
  }

  async upload(client: AWS.S3, file: File): Promise<File> {
    file.externalFileId = uuidv4();

    const res = await client.putObject({
      Body: file.data,
      Key: file.externalFileId,
      Bucket: this.payload.bucketName,
     }, (err: AWS.AWSError) => {
       if (err) {
         throw new Error(err.message);
       }
     }).promise();

     file.uploaded = !res.$response.error;

     file.createdTime = new Date();
     file.lastUpdateTime = new Date();

     return file;
  }

  async download(client: AWS.S3, externalFileId: string): Promise<any> {
    const res = await client.getObject({
      Key: externalFileId,
      Bucket: this.payload.bucketName,
     }, (err: AWS.AWSError) => {
       if (err) {
         throw new Error(err.message);
       }
     }).promise();

     return res.$response.data;
  }
  
}