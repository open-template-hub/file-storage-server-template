import fs from 'fs';

export class Builder {
  buildTemplate = (filePath: string, params: any) => {
    var template = '';

    try {
      template = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error('An error occurred while building template: ' + err);
    }

    if (params != undefined && params != null) {
      for (var entry of params.entries()) {
        template = template.replace(entry[0], entry[1]);
      }
    }
    console.log('Successfully build template: \n' + template);

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
