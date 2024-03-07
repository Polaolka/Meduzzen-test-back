const Joi = require('joi');
const { ERROR_DTO_PATTERNS } = require('../../constants');
const {
  USER_FIELDS_REFS: {
    name,
    email,
    password,
  },
} = require('../commonFieldsRefs');

// add user
const addUserDTO = Joi.object()
  .keys({
    name: name.required(),
    email: email.required(),
    password: password.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

module.exports = {
  addUserDTO
};

