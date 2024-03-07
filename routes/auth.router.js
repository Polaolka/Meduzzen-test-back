const express = require('express');
const authMiddleware = require('../middlewares/authenticate.middleware');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

// ----AUTH ROUTER -----

// GET

router.get('/current', authMiddleware.authenticate, AuthController.currentUser);

// POST
router.post('/register', AuthController.addUser);

router.post('/login', AuthController.loginUser);

router.post('/logout', AuthController.logoutUser);

router.post('/refresh', AuthController.refreshUser);

module.exports = router;
