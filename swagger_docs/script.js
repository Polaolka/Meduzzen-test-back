const LETTER_DOC = require('./docs/letter/letter');
const helper = require('./helper');

class Swagger {
  constructor() {
    this.base = {
      openapi: '3.0.1',
      info: {
        version: '0.0.1',
        title: 'requesty-lending-back',
        description: 'WEB API for data fetching',
      },
      servers: [
        {
          url: 'https://localhost:4000/api/v0',
          description: 'Main  API',
        },
      ],
    };
    this.PARTICLES = { paths: { ...LETTER_DOC } };
  }
  _toJSON() {
    const JSON_SWAGGER_DOCS = JSON.stringify({
      ...this.base,
      ...this.PARTICLES,
    });
    if (!JSON_SWAGGER_DOCS) {
      throw new Error('Data must be provided');
    }
    return JSON_SWAGGER_DOCS;
  }

  getDocs() {
    helper.pushToSwaggerJSON(this._toJSON());
  }
}

new Swagger().getDocs();
