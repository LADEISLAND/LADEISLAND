import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { chatAPI } from '../services/api';
import socketService from '../services/socket';
import './ChatPanel.css';

export default function ChatPanel() {
  const { user, isAuthenticated, currentSession, setCurrentSession } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const sessionId = currentSession || `session_${Date.now()}`;

  // Initialize session and socket
  useEffect(() => {
    if (!currentSession) {
      setCurrentSession(sessionId);
    }
    
    // Join room for real-time communication
    socketService.joinRoom(sessionId);
    
    // Load chat history
    loadChatHistory();

    // Setup socket listeners
    const handleAIResponse = (data) => {
      setMessages(prev => [...prev, {
        id: data.id,
        role: 'ai',
        text: data.content,
        timestamp: data.timestamp,
        responseTime: data.responseTime
      }]);
      setIsLoading(false);
    };

    const handleUserMessage = (data) => {
      setMessages(prev => [...prev, {
        id: data.id,
        role: 'user',
        text: data.content,
        timestamp: data.timestamp,
        user: data.user
      }]);
    };

    const handleTyping = (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
      } else {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    };

    socketService.on('ai-response', handleAIResponse);
    socketService.on('user-message', handleUserMessage);
    socketService.on('ai-message', handleAIResponse);
    socketService.on('user-typing', handleTyping);

    return () => {
      socketService.off('ai-response', handleAIResponse);
      socketService.off('user-message', handleUserMessage);
      socketService.off('ai-message', handleAIResponse);
      socketService.off('user-typing', handleTyping);
    };
  }, [sessionId, currentSession, setCurrentSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory(sessionId);
      const formattedMessages = response.data.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        text: msg.content,
        timestamp: msg.timestamp,
        responseTime: msg.responseTime
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send via socket for real-time communication
      socketService.sendMessage({
        content: messageText,
        sessionId,
        context: {
          solarSystemState: {}, // Could include current solar system state
          userLocation: {} // Could include user's current view
        }
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
      
      // Fallback: send via REST API
      try {
        const response = await chatAPI.sendMessage({
          content: messageText,
          sessionId,
          context: {
            solarSystemState: {},
            userLocation: {}
          }
        });
        
        setMessages(prev => [...prev, {
          id: `ai_${Date.now()}`,
          role: 'ai',
          text: response.data.message,
          timestamp: response.data.timestamp,
          responseTime: response.data.responseTime
        }]);
      } catch (apiError) {
        console.error('API fallback failed:', apiError);
        setMessages(prev => [...prev, {
          id: `error_${Date.now()}`,
          role: 'ai',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        }]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Typing indicators
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
      socketService.startTyping(sessionId);
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
      socketService.stopTyping(sessionId);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>🌌 Cosmos Chat</h3>
        {isAuthenticated && user && (
          <span className="user-info">Welcome, {user.username}!</span>
        )}
      </div>
      
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`msg ${message.role}`}>
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-meta">
              <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
              {message.responseTime && (
                <span className="response-time">({message.responseTime}ms)</span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="msg ai loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        {typingUsers.length > 0 && (
          <div className="typing-users">
            {typingUsers.map(user => (
              <span key={user.userId} className="typing-user">
                {user.username} is typing...
              </span>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-row">
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Cosmos about the solar system..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  );
}