import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ChatPanel.css';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize chat session on component mount
  useEffect(() => {
    initializeChatSession();
  }, []);

  const initializeChatSession = async () => {
    try {
      const response = await apiService.createChatSession({
        title: 'Cosmic Chat',
        context: 'cosmic'
      });
      
      if (response.success) {
        setSessionId(response.data.sessionId);
      }
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      setError('Failed to initialize chat. Please refresh the page.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Send message to backend
      const response = await apiService.sendMessage(sessionId, userMessage, 'cosmic');
      
      if (response.success) {
        // Add AI response to messages
        setMessages((prev) => [...prev, { role: 'assistant', text: response.data.message }]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      setMessages((prev) => [...prev, { 
        role: 'system', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>🚀 AGI Cosmic Chat</h3>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Welcome to AGI Cosmic! 🌌</p>
            <p>Ask me anything about space, aerospace technology, or cosmic phenomena.</p>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div key={idx} className={`msg ${m.role}`}>
            <div className="msg-content">{m.text}</div>
          </div>
        ))}
        
        {isLoading && (
          <div className="msg assistant loading">
            <div className="msg-content">
              <span className="typing-indicator">●●●</span>
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about space, aerospace, or cosmic phenomena..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}