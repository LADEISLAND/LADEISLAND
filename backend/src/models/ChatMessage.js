const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'ai', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    responseTime: {
      type: Number, // in milliseconds
      default: 0
    },
    tokens: {
      type: Number,
      default: 0
    },
    model: {
      type: String,
      default: 'gpt-3.5-turbo'
    }
  },
  context: {
    solarSystemState: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    userLocation: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatMessageSchema.index({ sessionId: 1, createdAt: -1 });
chatMessageSchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted timestamp
chatMessageSchema.virtual('formattedTimestamp').get(function() {
  return this.metadata.timestamp.toISOString();
});

// Method to get conversation history
chatMessageSchema.statics.getConversationHistory = function(sessionId, limit = 50) {
  return this.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate('user', 'username')
    .lean();
};

module.exports = mongoose.model('ChatMessage', chatMessageSchema);