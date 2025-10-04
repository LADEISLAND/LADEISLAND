const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const ChatSession = require('../models/ChatSession');
const logger = require('../config/logger');

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
    
    // Call OpenAI API (or your preferred AI service)
    let aiResponse;
    try {
      if (process.env.OPENAI_API_KEY) {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: chatSession.settings.model,
            messages: aiMessages,
            temperature: chatSession.settings.temperature,
            max_tokens: chatSession.settings.maxTokens
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        aiResponse = response.data.choices[0].message.content;
      } else {
        // Fallback response when no API key is configured
        aiResponse = generateFallbackResponse(message, chatSession.context);
      }
    } catch (apiError) {
      logger.error('AI API Error:', apiError);
      aiResponse = generateFallbackResponse(message, chatSession.context);
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
  const prompts = {
    cosmic: 'You are an AI assistant for the AGI Cosmic platform, specializing in aerospace technology, space exploration, and cosmic phenomena. Provide helpful, accurate, and engaging responses about space, technology, and related topics.',
    aerospace: 'You are an aerospace engineering expert. Provide technical guidance on aircraft design, propulsion systems, aerodynamics, and space technology.',
    ai: 'You are an AI and machine learning expert. Help with AI concepts, implementation, and best practices in artificial intelligence.',
    technical: 'You are a technical expert. Provide detailed technical explanations and solutions for engineering and technology problems.',
    general: 'You are a helpful AI assistant. Provide accurate and helpful responses to user questions.'
  };

  return prompts[context] || prompts.cosmic;
};

// Fallback response generator
const generateFallbackResponse = (message, context) => {
  const responses = {
    cosmic: [
      "Fascinating question about the cosmos! While I don't have access to real-time AI processing, I can tell you that space exploration continues to reveal amazing discoveries.",
      "The universe is vast and full of mysteries. Your question touches on important aspects of cosmic understanding.",
      "Space technology and cosmic phenomena are incredibly complex topics. Thank you for your interest in exploring the universe!"
    ],
    aerospace: [
      "That's an interesting aerospace engineering question! Modern aircraft and spacecraft design involves complex engineering principles.",
      "Aerospace technology continues to advance rapidly, with new innovations in propulsion and materials science.",
      "Flight dynamics and space systems require careful consideration of many engineering factors."
    ],
    general: [
      "Thank you for your question! I'm processing your request and working to provide helpful information.",
      "That's an interesting topic to explore. Let me help you understand this better.",
      "I appreciate your curiosity and am here to assist with your questions."
    ]
  };

  const contextResponses = responses[context] || responses.general;
  return contextResponses[Math.floor(Math.random() * contextResponses.length)];
};

module.exports = {
  createChatSession,
  sendMessage,
  getChatSession,
  getUserChatSessions,
  deleteChatSession
};