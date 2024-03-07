const authHelper = require('../helpers/auth.helper');

class Authenticate {
  constructor() {}

  async authenticate(req, res, next) {
    try {
      const { headers } = req;
      const bearerToken = authHelper.extractTokenFromAuthHeader(headers);
      const token = authHelper.getJwtToken(bearerToken);
      const payload = await authHelper.validateToken({
        type: 'ACCESS',
        token,
      });
      // console.log(token);

      req.id = payload.id;
    //   req.email = payload.email;
      req.token = token;
      return next();
    } catch (e) {
      next(e);
    }
  }

}

module.exports = new Authenticate();
