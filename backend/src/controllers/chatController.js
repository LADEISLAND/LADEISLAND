const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const ChatSession = require('../models/ChatSession');
const logger = require('../config/logger');
const aiService = require('../services/aiService');

// Create a new chat session
const createChatSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { title, context = 'cosmic', settings = {} } = req.body;

    const chatSession = new ChatSession({
      sessionId,
      userId: req.user ? req.user._id : null,
      title: title || 'New Cosmic Chat',
      context,
      settings: {
        model: settings.model || process.env.AI_MODEL || 'gpt-3.5-turbo',
        temperature: settings.temperature || 0.7,
        maxTokens: settings.maxTokens || 1000
      }
    });

    await chatSession.save();

    res.status(201).json({
      success: true,
      data: {
        sessionId: chatSession.sessionId,
        title: chatSession.title,
        context: chatSession.context,
        settings: chatSession.settings,
        createdAt: chatSession.createdAt
      }
    });
  } catch (error) {
    logger.error('Error creating chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat session'
    });
  }
};

// Send message and get AI response
const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ sessionId });
    
    if (!chatSession) {
      chatSession = new ChatSession({
        sessionId,
        userId: req.user ? req.user._id : null,
        context: context || 'cosmic'
      });
    }

    // Add user message
    await chatSession.addMessage('user', message.trim());

    // Prepare AI request
    const aiMessages = [
      {
        role: 'system',
        content: getSystemPrompt(chatSession.context)
      },
      ...chatSession.messages.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const startTime = Date.now();
    
    // Call AI Service (supports multiple providers)
    let aiResponse;
    try {
      const aiMessages = chatSession.messages.slice(-10); // Get last 10 messages for context
      aiResponse = await aiService.generateResponse(aiMessages, chatSession.context);
    } catch (apiError) {
      logger.error('AI API Error:', apiError);
      aiResponse = aiService.generateFallbackResponse(message, chatSession.context);
    }

    const responseTime = Date.now() - startTime;

    // Add AI response
    await chatSession.addMessage('assistant', aiResponse, {
      model: chatSession.settings.model,
      responseTime,
      context: chatSession.context
    });

    res.json({
      success: true,
      data: {
        sessionId: chatSession.sessionId,
        message: aiResponse,
        context: chatSession.context,
        responseTime,
        messageCount: chatSession.messageCount
      }
    });

  } catch (error) {
    logger.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
};

// Get chat session history
const getChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chatSession = await ChatSession.findOne({ sessionId });

    if (!chatSession) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    // Check if user has access to this session
    if (chatSession.userId && req.user && !chatSession.userId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this chat session'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: chatSession.sessionId,
        title: chatSession.title,
        messages: chatSession.messages,
        context: chatSession.context,
        settings: chatSession.settings,
        messageCount: chatSession.messageCount,
        lastActivity: chatSession.lastActivity,
        createdAt: chatSession.createdAt
      }
    });
  } catch (error) {
    logger.error('Error getting chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat session'
    });
  }
};

// Get user's chat sessions
const getUserChatSessions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const sessions = await ChatSession.find({ 
      userId: req.user._id,
      isActive: true 
    })
    .select('sessionId title context messageCount lastActivity createdAt')
    .sort({ lastActivity: -1 })
    .limit(50);

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    logger.error('Error getting user chat sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat sessions'
    });
  }
};

// Delete chat session
const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chatSession = await ChatSession.findOne({ sessionId });

    if (!chatSession) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    // Check if user has access to delete this session
    if (chatSession.userId && req.user && !chatSession.userId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to delete this chat session'
      });
    }

    chatSession.isActive = false;
    await chatSession.save();

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete chat session'
    });
  }
};

// Helper function to get system prompt based on context
const getSystemPrompt = (context) => {
  // This function is now handled by the AI service
  return aiService.getSystemPrompt(context);
};

// Fallback response generator  
const generateFallbackResponse = (message, context) => {
  // This function is now handled by the AI service
  return aiService.generateFallbackResponse(message, context);
};

module.exports = {
  createChatSession,
  sendMessage,
  getChatSession,
  getUserChatSessions,
  deleteChatSession
};