const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express.Router();

// ----USER ROUTER -----

// GET
router.get(
  '/',
  UserController.getUsers
);

module.exports = router;
