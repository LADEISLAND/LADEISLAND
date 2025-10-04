const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    model: String,
    tokens: Number,
    responseTime: Number,
    context: String
  }
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous sessions
  },
  title: {
    type: String,
    default: 'New Cosmic Chat'
  },
  messages: [MessageSchema],
  context: {
    type: String,
    enum: ['general', 'aerospace', 'ai', 'cosmic', 'technical'],
    default: 'cosmic'
  },
  settings: {
    model: {
      type: String,
      default: 'gpt-3.5-turbo'
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    maxTokens: {
      type: Number,
      default: 1000
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update last activity on save
ChatSessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Generate session title from first message
ChatSessionSchema.methods.generateTitle = function() {
  if (this.messages.length > 0) {
    const firstUserMessage = this.messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      this.title = content.length > 50 ? content.substring(0, 47) + '...' : content;
    }
  }
  return this.title;
};

// Add message to session
ChatSessionSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata
  });
  
  // Auto-generate title if it's still default and we have messages
  if (this.title === 'New Cosmic Chat' && this.messages.length >= 2) {
    this.generateTitle();
  }
  
  return this.save();
};

// Get message count
ChatSessionSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Get user message count
ChatSessionSchema.virtual('userMessageCount').get(function() {
  return this.messages.filter(msg => msg.role === 'user').length;
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);