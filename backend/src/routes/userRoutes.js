const express = require('express');
const {
  getUserStats,
  getChatHistory,
  exportUserData,
  deleteUserData
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/stats', getUserStats);
router.get('/chat-history', getChatHistory);
router.get('/export', exportUserData);
router.delete('/delete-data', deleteUserData);

module.exports = router;