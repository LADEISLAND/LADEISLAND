const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const aiService = require('../services/aiService');

const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        // Allow anonymous connections
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user) {
        socket.userId = user._id;
        socket.user = user;
      }
      
      next();
    } catch (error) {
      // Allow connection even if token is invalid
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id} ${socket.user ? `(${socket.user.username})` : '(anonymous)'}`);

    // Join a chat room
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.emit('joined-room', { roomId, timestamp: new Date().toISOString() });
      console.log(`👥 User ${socket.id} joined room: ${roomId}`);
    });

    // Leave a chat room
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      socket.emit('left-room', { roomId, timestamp: new Date().toISOString() });
      console.log(`👋 User ${socket.id} left room: ${roomId}`);
    });

    // Handle real-time chat messages
    socket.on('chat-message', async (data) => {
      try {
        const { content, sessionId, roomId, context } = data;
        
        if (!content || !sessionId) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        const startTime = Date.now();

        // Save user message
        const userMessage = new ChatMessage({
          user: socket.userId || null,
          sessionId,
          role: 'user',
          content,
          context
        });
        await userMessage.save();

        // Broadcast user message to room
        if (roomId) {
          socket.to(roomId).emit('user-message', {
            id: userMessage._id,
            content,
            timestamp: userMessage.metadata.timestamp,
            user: socket.user ? { username: socket.user.username } : null
          });
        }

        // Get conversation history for AI context
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
          user: socket.userId || null,
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

        // Send AI response back to sender
        socket.emit('ai-response', {
          id: aiMessage._id,
          content: aiResponse.content,
          timestamp: aiMessage.metadata.timestamp,
          responseTime,
          tokens: aiResponse.tokens || 0
        });

        // Broadcast AI response to room
        if (roomId) {
          socket.to(roomId).emit('ai-message', {
            id: aiMessage._id,
            content: aiResponse.content,
            timestamp: aiMessage.metadata.timestamp,
            responseTime
          });
        }

      } catch (error) {
        console.error('Socket chat error:', error);
        socket.emit('error', { message: 'Failed to process message' });
      }
    });

    // Handle solar system state updates
    socket.on('solar-system-update', (data) => {
      const { roomId, state } = data;
      
      if (roomId) {
        // Broadcast state update to all users in the room
        socket.to(roomId).emit('solar-system-state', {
          state,
          timestamp: new Date().toISOString(),
          updatedBy: socket.user ? socket.user.username : 'anonymous'
        });
      }
    });

    // Handle user presence updates
    socket.on('user-presence', (data) => {
      const { roomId, status } = data; // status: 'active', 'idle', 'away'
      
      if (roomId) {
        socket.to(roomId).emit('user-status', {
          userId: socket.userId || socket.id,
          username: socket.user ? socket.user.username : 'Anonymous',
          status,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { roomId } = data;
      
      if (roomId) {
        socket.to(roomId).emit('user-typing', {
          userId: socket.userId || socket.id,
          username: socket.user ? socket.user.username : 'Anonymous',
          isTyping: true
        });
      }
    });

    socket.on('typing-stop', (data) => {
      const { roomId } = data;
      
      if (roomId) {
        socket.to(roomId).emit('user-typing', {
          userId: socket.userId || socket.id,
          username: socket.user ? socket.user.username : 'Anonymous',
          isTyping: false
        });
      }
    });

    // Handle planet exploration events
    socket.on('planet-explore', async (data) => {
      try {
        const { planetName, roomId } = data;
        
        const planetInfo = await aiService.generatePlanetDescription(planetName);
        
        // Send planet info to sender
        socket.emit('planet-info', {
          planet: planetName,
          description: planetInfo,
          timestamp: new Date().toISOString()
        });

        // Broadcast to room if specified
        if (roomId) {
          socket.to(roomId).emit('planet-explored', {
            planet: planetName,
            description: planetInfo,
            exploredBy: socket.user ? socket.user.username : 'Anonymous',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Planet explore error:', error);
        socket.emit('error', { message: 'Failed to get planet information' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${socket.id} (${reason})`);
      
      // Notify rooms about user leaving
      socket.rooms.forEach(roomId => {
        if (roomId !== socket.id) { // Don't notify the default room
          socket.to(roomId).emit('user-left', {
            userId: socket.userId || socket.id,
            username: socket.user ? socket.user.username : 'Anonymous',
            timestamp: new Date().toISOString()
          });
        }
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Periodic cleanup of inactive connections
  setInterval(() => {
    const connectedSockets = io.sockets.sockets.size;
    console.log(`📊 Active connections: ${connectedSockets}`);
  }, 60000); // Log every minute
};

module.exports = { setupSocketHandlers };