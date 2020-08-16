import { FileService } from "./file-service.model";

export interface ServiceClient {
  client: any;
  service: FileService;
}