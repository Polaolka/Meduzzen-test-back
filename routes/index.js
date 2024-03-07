const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger_docs/swagger.json');

const router = express.Router();
const Config = require('../config');
//
const baseMiddleware = require('../middlewares/base.middleware');
//
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const chatRouter = require('./chat.router');

// ============= ROUTES ===================

// AUTH
router.use(`${Config.BASE_APP_ENDPOINT_FOR_ROUTER}/auth`, authRouter);
// USER
router.use(`${Config.BASE_APP_ENDPOINT_FOR_ROUTER}/users`, userRouter);
// CHAT
router.use(`${Config.BASE_APP_ENDPOINT_FOR_ROUTER}/chats`, chatRouter);

// SWAGGER
router.use(
  `${Config.BASE_APP_ENDPOINT_FOR_ROUTER}/swagger/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

router.use(baseMiddleware.NotFoundHandler);
router.use(baseMiddleware.ErrorHandler);

module.exports = router;
