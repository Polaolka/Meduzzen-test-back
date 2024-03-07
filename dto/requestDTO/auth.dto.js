const Joi = require('joi');
const { ERROR_DTO_PATTERNS } = require('../../constants');
const {
  USER_FIELDS_REFS: { name, email, password, id, refreshToken },
} = require('../commonFieldsRefs');

// add user
const addUserDTO = Joi.object()
  .keys({
    name: name.required(),
    email: email.required(),
    password: password.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

const loginUserDTO = Joi.object()
  .keys({
    email: email.required(),
    password: password.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

  const logoutUserDTO = Joi.object()
  .keys({
    id: id.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

  const currentUserDTO = Joi.object()
  .keys({
    id: id.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

  const refreshUserDTO = Joi.object()
  .keys({
    refreshToken: refreshToken.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

  
module.exports = {
  addUserDTO,
  loginUserDTO,
  logoutUserDTO,
  currentUserDTO,
  refreshUserDTO
};

