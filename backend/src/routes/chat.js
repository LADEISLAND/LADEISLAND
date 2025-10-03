const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const aiService = require('../services/aiService');
const { validateRequest, schemas } = require('../middleware/validation');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Send a chat message
router.post('/send', optionalAuth, validateRequest(schemas.chatMessage), async (req, res) => {
  try {
    const { content, sessionId, context } = req.body;
    const startTime = Date.now();

    // Save user message
    const userMessage = new ChatMessage({
      user: req.user?._id || null,
      sessionId,
      role: 'user',
      content,
      context
    });
    await userMessage.save();

    // Get conversation history for context
    const conversationHistory = await ChatMessage.getConversationHistory(sessionId, 10);
    const messages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate AI response
    const aiResponse = await aiService.generateResponse(messages, context);
    const responseTime = Date.now() - startTime;

    // Save AI response
    const aiMessage = new ChatMessage({
      user: req.user?._id || null,
      sessionId,
      role: 'ai',
      content: aiResponse.content,
      metadata: {
        responseTime,
        tokens: aiResponse.tokens || 0,
        model: aiResponse.model || 'fallback'
      },
      context
    });
    await aiMessage.save();

    res.json({
      message: aiResponse.content,
      sessionId,
      timestamp: aiMessage.metadata.timestamp,
      responseTime,
      tokens: aiResponse.tokens || 0
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history for a session
router.get('/history/:sessionId', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('user', 'username')
      .lean();

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.metadata.timestamp,
        responseTime: msg.metadata.responseTime,
        tokens: msg.metadata.tokens
      })),
      sessionId,
      total: messages.length
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get planet information
router.get('/planet/:planetName', async (req, res) => {
  try {
    const { planetName } = req.params;
    const description = await aiService.generatePlanetDescription(planetName);
    
    res.json({
      planet: planetName,
      description,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Planet info error:', error);
    res.status(500).json({ error: 'Failed to get planet information' });
  }
});

// Get user's chat sessions (if authenticated)
router.get('/sessions', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ sessions: [] });
    }

    const sessions = await ChatMessage.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $max: '$createdAt' },
          messageCount: { $sum: 1 },
          firstMessage: { $min: '$createdAt' }
        }
      },
      { $sort: { lastMessage: -1 } },
      { $limit: 20 }
    ]);

    res.json({ sessions });
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Clear chat history for a session
router.delete('/session/:sessionId', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const query = { sessionId };
    if (req.user) {
      query.user = req.user._id;
    }

    const result = await ChatMessage.deleteMany(query);
    
    res.json({
      message: 'Chat history cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;