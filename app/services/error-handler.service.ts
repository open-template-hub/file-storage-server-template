/**
 * Error Handler
 */

import { ResponseCode } from "../constant";

export const handle = (exception: { message: any; responseCode: number; }) => {
  let response = {
    code: ResponseCode.BAD_REQUEST,
    message: exception.message
  };

  // Overwrite Response Code and Message here
  if (exception.responseCode) {
    response.code = exception.responseCode;
  }

  return response;
}
