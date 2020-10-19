/**
 * Error Handler
 */

// debug logger
const debugLog = require('debug')('file-server:' + __filename.slice(__dirname.length + 1));

import { ResponseCode } from "../util/constant";

export const handle = (exception: { message: any; responseCode: number; }) => {
 let response = {
  code: ResponseCode.BAD_REQUEST,
  message: exception.message
 };

 // Overwrite Response Code and Message here
 if (exception.responseCode) {
  response.code = exception.responseCode;
 }

 debugLog(exception);
 console.error(response);

 return response;
}
