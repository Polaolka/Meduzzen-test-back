const Joi = require('joi').extend(require('@joi/date'));

const {
  REGULAR_EXPRESSIONS,
} = require('../constants');
// ==== COMMON REFS ====
// ____LETTER FIELDS REFS____

const USER_FIELDS_REFS = {
  id: Joi.string(),
  name: Joi.string().min(2).max(100).regex(REGULAR_EXPRESSIONS.NAME_REGEX),
  email: Joi.string().regex(REGULAR_EXPRESSIONS.EMAIL_REGEX),
  password: Joi.string().min(4).regex(REGULAR_EXPRESSIONS.PASSWORD_REGEX),
  anyString: Joi.string().allow(null), 
  status: Joi.number(),
  refreshToken: Joi.string(),
  imgs: Joi.any(),
  userId: Joi.string(),
  // file: Joi.string(),
  chatId: Joi.string(),
  sender: Joi.string(),
  content: Joi.string() ,
  messageId: Joi.string()
};
// ==== ==== ==== ==== ==== ==== ==== ==== ==== ====

module.exports = { USER_FIELDS_REFS };
