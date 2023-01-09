import { FileType } from '../enum/file-type.enum';

export class FileUtil {
  isPublicFileType = ( type: FileType ) => {
    if (
        type === FileType.TEAM_COVER_PICTURE ||
        type === FileType.TEAM_PROFILE_PICTURE ||
        type === FileType.USER_COVER_PICTURE ||
        type === FileType.USER_PROFILE_PICTURE
    ) {
      return true;
    }

    return false;
  };
}
