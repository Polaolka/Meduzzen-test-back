require('dotenv').config();

const {
  BASE_URL,
  BASE_APP_ENDPOINT,
  PORT,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;
class Config {
  constructor() {
    this.PORT = PORT || 4000;
    this.BASE_URL = BASE_URL || '';
    this.BASE_APP_ENDPOINT_FOR_ROUTER = BASE_APP_ENDPOINT || '/api/v0';
    this.JWT_ACCESS_SECRET =
      JWT_ACCESS_SECRET || 'my-super-secret-access-token-my-super-secret';
    this.JWT_REFRESH_SECRET =
      JWT_REFRESH_SECRET || 'my-super-secret-refresh-token-my-super-secret';
  }
}
module.exports = new Config();
