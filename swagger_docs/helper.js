const fs = require('fs/promises');
const path = require('path');

class Helper {
  constructor() {
    this.encoding = 'utf8';
  }

  async createFileForDocs({ fileName }) {
    //
    if (!fileName) {
      throw new Error('File name is required!');
    }
    //

    await this._generateFile({ fileName: `${fileName}.js` });
  }

  async _generateFile({ fileName }) {
    try {
      console.log('Start generating the file!');
      //
      await fs.open(path.join(fileName), 'w');

      console.log(`The file: "${fileName}" has been generated!`);
    } catch (e) {
      console.log(e);
    }
  }

  async pushToSwaggerJSON(data) {
    console.log('Checking has file already exist... ');
    const path = __dirname + '/swagger.json';

    await fs.writeFile(path, data, { encoding: this.encoding });
  }
}
module.exports = new Helper();
