import fs from 'fs';

// debug logger
const debugLog = require('debug')('file-server:' + __filename.slice(__dirname.length + 1));

export class Builder {
  buildTemplateFromFile = (filePath: string, params: any) => {
    var template = '';

    try {
      template = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error(err);
    }

    if (params != undefined) {
      for (var entry of params.entries()) {
        template = template.replace(entry[0], entry[1]);
      }
    }
    debugLog('Successfully build template: \n' + template);

    return template;
  }

  buildUrl = (url: string, params: Array<string>) => {
    let generatedUrl = url;
    for (let i = 0; i < params.length; i++) {
      let param = params[i];
      generatedUrl = generatedUrl.replace('{{' + i + '}}', param);
    }
    return generatedUrl;
  }
}
