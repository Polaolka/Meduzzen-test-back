const mapper = require('../dto/mapper');
const authService = require('../services/auth.service');
const {
  addUserDTO,
  loginUserDTO,
  logoutUserDTO,
  currentUserDTO,
  refreshUserDTO
} = require('../dto/requestDTO/auth.dto');

class Auth {
  constructor() {}

  // ---- ADD USER ----
  static async addUser(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: addUserDTO,
      });
      const response = await authService.addUser(RequestDTO);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  // ---- LOGIN USER ----
  static async loginUser(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: loginUserDTO,
      });
      const response = await authService.loginUser(RequestDTO);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
  // ---- LOGOUT USER ----
  static async logoutUser(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: logoutUserDTO,
      });
      const response = await authService.logoutUser(RequestDTO);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  static async currentUser(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: currentUserDTO,
      });
      const response = await authService.currentUser(RequestDTO);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }

  static async refreshUser(req, res, next) {
    try {
      const RequestDTO = await mapper.toRequestDTO({
        data: req,
        validationSchema: refreshUserDTO,
      });
      const response = await authService.refreshUser(RequestDTO);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = Auth;
