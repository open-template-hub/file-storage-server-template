export interface File {
  id: number;
  title: string;
  description: string;
  externalFileId: string;
  createdTime: Date;
  lastUpdateTime: Date;
  data: Blob;
  contentType: string;
  uploaded: boolean;
}