const express = require('express');
const ChatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/authenticate.middleware');
const router = express.Router();

// ----USER ROUTER -----

// POST
router.post('/chat', authMiddleware.authenticate, ChatController.openChat);

// POST
router.post('/new-message', authMiddleware.authenticate, ChatController.addMessage);

// PARCH
router.patch('/edit/:messageId', authMiddleware.authenticate, ChatController.editMessage);

// DELETE
router.delete('/delete/:messageId', authMiddleware.authenticate, ChatController.deleteMessage);

module.exports = router;
