export interface File {
  id: number;
  title: string;
  description: string;
  external_file_id: string;
  created_time: Date;
  last_update_time: Date;
  data: Blob;
  content_type: string;
  uploaded: boolean;
  service_key: string;
}
