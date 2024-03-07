const axios = require('axios');
const { config } = require('../config');
const HttpException = require('../helpers/HttpException.helper');
const {
  HTTP__CODES_STATUS,
} = require('../constants/errorExceptions/HttpException.contants');
class Super {
  constructor({ BASE_ENDPOINT }) {
    this.BASE_ENDPOINT = BASE_ENDPOINT || '';
  }

  async GET({ path, query, options, fullResponse }) {
    return this._fetchTo({
      method: 'GET',
      path,
      query,
      options,
      fullResponse,
    });
  }
  async POST({ path, body, query, options, fullResponse, customHeaders }) {
    return this._fetchTo({
      method: 'POST',
      path,
      body,
      query,
      options,
      fullResponse,
      customHeaders
    });
  }
  async PUT({ path, body, query, options, fullResponse }) {
    return this._fetchTo({
      method: 'PUT',
      path,
      body,
      query,
      options,
      fullResponse,
    });
  }
  async DELETE({ path, body, query, options, fullResponse, customHeaders }) {
    return this._fetchTo({
      method: 'DELETE',
      path,
      body,
      query,
      options,
      fullResponse,
      customHeaders 
    });
  }
  async _fetchTo({
    method = 'GET',
    path = '',
    query = {},
    body = {},
    fullResponse = false,
    customHeaders  = {}
  }) {
    try {
      const headers = {
        SecurityToken: this.SECURITY_TOKEN,
      };
      const axiosOptions = {
        method,
        url: `${this.MICROSERVICE_URL}${this.BASE_ENDPOINT}${path}`,
        data: body,
        headers: {...customHeaders, ...headers},
        params: query,
      };
      //
      if (!fullResponse) {
        const { data } = await axios(axiosOptions);
        return data;
      }
      const response = await axios(axiosOptions);
      //
      return response;
    } catch (e) {
      this._responseErrorHandler(e);
    }
  }
  _responseErrorHandler(error) {
    const message = error.response.data.error;
    throw HttpException[HTTP__CODES_STATUS[error.response.status]](message);
  }
}
module.exports = Super;
