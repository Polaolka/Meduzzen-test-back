const mapper = require('../dto/mapper');
const chatService = require('../services/chat.service');
const {
  openChatDTO,
  addMessageDTO,
  editMessageDTO,
  deleteMessageDTO
} = require('../dto/requestDTO/chat.dto');

class Chat {
  constructor() {}

  // ---- ADD/OPEN CHAT ----
  static async openChat(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: openChatDTO,
      });
      const response = await chatService.openChat(RequestDTO);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  // ---- ADD MESSAGE ----
  static async addMessage(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: addMessageDTO,
      });
      const response = await chatService.addMessage(RequestDTO);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  // ---- EDITE MESSAGE ----
  static async editMessage(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req.body.data,
        validationSchema: editMessageDTO,
      });
      console.log("RequestDTO:", RequestDTO);
      const response = await chatService.editMessage(RequestDTO);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  // ---- DELETE MESSAGE ----
  static async deleteMessage(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: deleteMessageDTO,
      });
      const response = await chatService.deleteMessage(RequestDTO);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
  
}

module.exports = Chat;
