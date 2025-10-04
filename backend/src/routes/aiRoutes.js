const express = require('express');
const aiService = require('../services/aiService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get AI service status
router.get('/status', async (req, res) => {
  try {
    const status = await aiService.healthCheck();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check AI service status'
    });
  }
});

// Get available AI providers
router.get('/providers', (req, res) => {
  try {
    const providers = aiService.constructor.getAvailableProviders();
    res.json({
      success: true,
      data: {
        current: process.env.AI_PROVIDER || 'huggingface',
        available: providers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get AI providers'
    });
  }
});

// Test AI response (protected route)
router.post('/test', protect, async (req, res) => {
  try {
    const { message, context = 'cosmic' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const startTime = Date.now();
    const response = await aiService.generateResponse(
      [{ role: 'user', content: message }], 
      context
    );
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        response,
        responseTime,
        provider: aiService.provider,
        context
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate test response'
    });
  }
});

module.exports = router;