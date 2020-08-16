import { FileService } from "../models/file-service.model";
import { S3FileService } from "../providers/s3-file-service.provider";
import { File } from "../models/file.model";
import { FileServiceEnum } from "../enums/file-service.enum";

export class FileServiceWrapper implements FileService {
  uploadService: FileService | undefined;

  constructor(uploadService: FileServiceEnum) {
    switch (uploadService) {
      case FileServiceEnum.S3:
      this.uploadService = new S3FileService();
      break;
      default:
      this.uploadService = undefined;
    }
  }

  initializeClient = async(providerConfig: any): Promise<any> => {
    if (this.uploadService === undefined) return null;
    return await this.uploadService.initializeClient(providerConfig);
  }

  upload = async(client: any, file: File): Promise<File> => {
    if (this.uploadService === undefined) return file;
    return await this.uploadService.upload(client, file);
  }

  download = async(client: any, externalFileId: string): Promise<any> => {
    if (this.uploadService === undefined) return null;
    return await this.uploadService.download(client, externalFileId);
  }
}