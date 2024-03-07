const Joi = require('joi');
const { ERROR_DTO_PATTERNS } = require('../../constants');
const {
  USER_FIELDS_REFS: { imgs, chatId, sender, id, content, messageId, userId, name },
} = require('../commonFieldsRefs');

// add user
const openChatDTO = Joi.object()
  .keys({
    chatId: id.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

// add message
const addMessageDTO = Joi.object()
  .keys({
    content: content.required(),
    sender: sender.required(),
    senderName: name.required(),
    imgs: imgs,
    chatId: chatId.required(),
  })
  .messages(ERROR_DTO_PATTERNS);

  // edit message
const editMessageDTO = Joi.object()
.keys({
  content: content.required(),
  messageId: messageId.required(),
  userId: userId.required(),
  chatId: chatId.required(),
})
.messages(ERROR_DTO_PATTERNS);

  // delete message
const deleteMessageDTO = Joi.object()
.keys({
  messageId: messageId.required(),
  userId: userId.required(),
  chatId: chatId.required(),
})

module.exports = {
  openChatDTO,
  addMessageDTO,
  editMessageDTO,
  deleteMessageDTO
};


// {
//   "content": "content content content",
//   "sender": "rG7MDbT5tzvsiEYVvoYK",
//   // files: files,
//   "chatId": "80jtbCTVYCkqagjY9hJh_rG7MDbT5tzvsiEYVvoYK"
// }