const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const logger = require('../config/logger');

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get chat session stats
    const chatStats = await ChatSession.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMessages: { $sum: { $size: '$messages' } },
          avgMessagesPerSession: { $avg: { $size: '$messages' } }
        }
      }
    ]);

    // Get recent activity
    const recentSessions = await ChatSession.find({ userId, isActive: true })
      .select('sessionId title lastActivity messageCount')
      .sort({ lastActivity: -1 })
      .limit(5);

    const stats = chatStats[0] || {
      totalSessions: 0,
      totalMessages: 0,
      avgMessagesPerSession: 0
    };

    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          memberSince: req.user.createdAt,
          lastLogin: req.user.lastLogin
        },
        chatStats: {
          totalSessions: stats.totalSessions,
          totalMessages: stats.totalMessages,
          avgMessagesPerSession: Math.round(stats.avgMessagesPerSession || 0)
        },
        recentActivity: recentSessions
      }
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user statistics'
    });
  }
};

// Get user's chat history summary
const getChatHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, context } = req.query;
    const userId = req.user._id;

    const query = { userId, isActive: true };
    if (context) {
      query.context = context;
    }

    const sessions = await ChatSession.find(query)
      .select('sessionId title context messageCount lastActivity createdAt')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ChatSession.countDocuments(query);

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    logger.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history'
    });
  }
};

// Export user data
const exportUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId).select('-password');
    
    // Get all chat sessions
    const chatSessions = await ChatSession.find({ userId, isActive: true });

    const exportData = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      chatSessions: chatSessions.map(session => ({
        sessionId: session.sessionId,
        title: session.title,
        context: session.context,
        messages: session.messages,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      })),
      exportedAt: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="agi-cosmic-data-${user.username}-${Date.now()}.json"`);
    
    res.json({
      success: true,
      data: exportData
    });

    logger.info(`Data exported for user: ${user.email}`);
  } catch (error) {
    logger.error('Export user data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export user data'
    });
  }
};

// Delete user data (GDPR compliance)
const deleteUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { confirmDelete } = req.body;

    if (!confirmDelete) {
      return res.status(400).json({
        success: false,
        error: 'Please confirm deletion by setting confirmDelete to true'
      });
    }

    // Delete all chat sessions
    await ChatSession.deleteMany({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'All user data has been permanently deleted'
    });

    logger.info(`User data deleted: ${req.user.email}`);
  } catch (error) {
    logger.error('Delete user data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user data'
    });
  }
};

module.exports = {
  getUserStats,
  getChatHistory,
  exportUserData,
  deleteUserData
};