import { File } from "./file.model";

export interface FileService {
  initializeClient(providerConfig: any): Promise<any>;
  upload(client: any, file: File): Promise<File>;
  download(client: any, externalFileId: string): Promise<any>;
}