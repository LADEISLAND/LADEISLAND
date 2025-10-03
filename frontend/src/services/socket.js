import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token = null) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const serverURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(serverURL, {
      auth: {
        token: token || localStorage.getItem('authToken')
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
      this.isConnected = true;
      this.emit('connection-status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
      this.isConnected = false;
      this.emit('connection-status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.emit('connection-error', error);
    });

    // Chat events
    this.socket.on('ai-response', (data) => {
      this.emit('ai-response', data);
    });

    this.socket.on('user-message', (data) => {
      this.emit('user-message', data);
    });

    this.socket.on('ai-message', (data) => {
      this.emit('ai-message', data);
    });

    // Room events
    this.socket.on('joined-room', (data) => {
      this.emit('joined-room', data);
    });

    this.socket.on('left-room', (data) => {
      this.emit('left-room', data);
    });

    // Solar system events
    this.socket.on('solar-system-state', (data) => {
      this.emit('solar-system-state', data);
    });

    // User events
    this.socket.on('user-status', (data) => {
      this.emit('user-status', data);
    });

    this.socket.on('user-typing', (data) => {
      this.emit('user-typing', data);
    });

    this.socket.on('user-left', (data) => {
      this.emit('user-left', data);
    });

    // Planet events
    this.socket.on('planet-info', (data) => {
      this.emit('planet-info', data);
    });

    this.socket.on('planet-explored', (data) => {
      this.emit('planet-explored', data);
    });

    // Error events
    this.socket.on('error', (data) => {
      this.emit('socket-error', data);
    });
  }

  // Event subscription
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Event unsubscription
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit custom events
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Socket.IO methods
  joinRoom(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-room', roomId);
    }
  }

  sendMessage(data) {
    if (this.socket?.connected) {
      this.socket.emit('chat-message', data);
    }
  }

  updateSolarSystem(data) {
    if (this.socket?.connected) {
      this.socket.emit('solar-system-update', data);
    }
  }

  updatePresence(status) {
    if (this.socket?.connected) {
      this.socket.emit('user-presence', { status });
    }
  }

  startTyping(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('typing-start', { roomId });
    }
  }

  stopTyping(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('typing-stop', { roomId });
    }
  }

  explorePlanet(planetName, roomId = null) {
    if (this.socket?.connected) {
      this.socket.emit('planet-explore', { planetName, roomId });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socket: this.socket
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;