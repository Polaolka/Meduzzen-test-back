const JWT = require('jsonwebtoken');
const Config = require('../config');
const HttpException = require('./HttpException.helper');

class Auth {
  constructor() {}

  async validateToken({ type, token }) {
    try {
      const types = {
        ACCESS: Config.JWT_ACCESS_SECRET,
        REFRESH: Config.JWT_REFRESH_SECRET,
      };
      if (!types[type]) {
        throw new Error('Invalid token type');
      }
      const secret = types[type];
      const payload = JWT.verify(token, secret);

      return payload;
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw HttpException.UNAUTHORIZED(`${type} token expired`);
      }
      console.log(e.message);
      console.log(
        '======================================================================'
      );
      throw HttpException.UNAUTHORIZED();
    }
  }

  extractTokenFromAuthHeader(headers) {
    if (!headers) {
      throw HttpException.BAD_REQUEST('The headers are required');
    }
    const { Authorization, authorization } = headers;
    const bearerToken = Authorization || authorization;
    if (!bearerToken) {
      throw HttpException.UNAUTHORIZED('Token are required');
    }

    return bearerToken;
  }

  getJwtToken(bearerToken) {
    const [Bearer, token] = bearerToken.split(' ');

    if (!Bearer || !token) {
      throw HttpException.BAD_REQUEST('Invalid Authorization header');
    }

    return token;
  }

  async decodeToken(token, options = {}) {
    return JWT.decode(token, options);
  }

}

module.exports = new Auth();
