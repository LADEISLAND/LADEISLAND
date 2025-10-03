const express = require('express');
const {
  createChatSession,
  sendMessage,
  getChatSession,
  getUserChatSessions,
  deleteChatSession
} = require('../controllers/chatController');
const { optionalAuth, protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.post('/sessions', optionalAuth, createChatSession);
router.post('/sessions/:sessionId/messages', optionalAuth, sendMessage);
router.get('/sessions/:sessionId', optionalAuth, getChatSession);

// Protected routes (auth required)
router.get('/sessions', protect, getUserChatSessions);
router.delete('/sessions/:sessionId', protect, deleteChatSession);

module.exports = router;