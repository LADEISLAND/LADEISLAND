import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Settings, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import apiService from '../../services/api';
import './EnhancedChatPanel.css';

const EnhancedChatPanel = ({ 
  user, 
  isMinimized = false, 
  onToggleMinimize,
  onPlanetContext 
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [chatContext, setChatContext] = useState('cosmic');
  const [showSettings, setShowSettings] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Chat contexts with different AI personalities
  const contexts = {
    cosmic: {
      name: '🌌 Cosmic Explorer',
      description: 'General space and cosmic phenomena',
      color: '#4facfe',
      prompt: 'cosmic exploration and space phenomena'
    },
    aerospace: {
      name: '🚀 Aerospace Engineer',
      description: 'Aircraft and spacecraft engineering',
      color: '#667eea',
      prompt: 'aerospace engineering and technology'
    },
    ai: {
      name: '🤖 AI Specialist',
      description: 'Artificial intelligence and machine learning',
      color: '#764ba2',
      prompt: 'artificial intelligence and machine learning'
    },
    technical: {
      name: '⚙️ Technical Expert',
      description: 'Technical engineering solutions',
      color: '#f093fb',
      prompt: 'technical engineering and solutions'
    }
  };

  // Initialize chat session
  useEffect(() => {
    initializeChatSession();
    setupSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle planet context changes
  useEffect(() => {
    if (onPlanetContext) {
      handlePlanetContext(onPlanetContext);
    }
  }, [onPlanetContext]);

  const initializeChatSession = async () => {
    try {
      const response = await apiService.createChatSession({
        title: 'AGI Cosmic Chat',
        context: chatContext
      });
      
      if (response.success) {
        setSessionId(response.data.sessionId);
        
        // Add welcome message
        setMessages([{
          id: Date.now(),
          role: 'assistant',
          content: `Welcome to AGI Cosmic! 🚀 I'm your ${contexts[chatContext].name}. Ask me anything about ${contexts[chatContext].prompt}!`,
          timestamp: new Date(),
          context: chatContext
        }]);
      }
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      setError('Failed to initialize chat. Please refresh the page.');
    }
  };

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      context: chatContext
    };

    setInput('');
    setIsLoading(true);
    setError(null);
    setTypingIndicator(true);

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to backend
      const response = await apiService.sendMessage(sessionId, userMessage.content, chatContext);
      
      if (response.success) {
        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
          context: chatContext,
          responseTime: response.data.responseTime
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'system',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleContextChange = (newContext) => {
    setChatContext(newContext);
    setShowSettings(false);
    
    // Add context change message
    const contextMessage = {
      id: Date.now(),
      role: 'system',
      content: `Switched to ${contexts[newContext].name} mode. I'm now specialized in ${contexts[newContext].prompt}.`,
      timestamp: new Date(),
      context: newContext
    };
    
    setMessages(prev => [...prev, contextMessage]);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: `Chat cleared! I'm your ${contexts[chatContext].name}. How can I help you today?`,
      timestamp: new Date(),
      context: chatContext
    }]);
    setError(null);
  };

  const handlePlanetContext = (planetInfo) => {
    const planetMessage = {
      id: Date.now(),
      role: 'system',
      content: `🪐 You're now viewing ${planetInfo.name}. Ask me anything about this planet!`,
      timestamp: new Date(),
      context: 'cosmic',
      planetContext: planetInfo
    };
    
    setMessages(prev => [...prev, planetMessage]);
    
    // Auto-focus input for follow-up questions
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isMinimized) {
    return (
      <div className="chat-panel chat-panel--minimized">
        <button 
          className="chat-panel__restore"
          onClick={onToggleMinimize}
          title="Restore chat"
        >
          <div className="chat-indicator">
            <span className="chat-indicator__icon">💬</span>
            <span className="chat-indicator__text">Chat</span>
            {messages.length > 1 && (
              <span className="chat-indicator__count">{messages.length - 1}</span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-panel__header">
        <div className="chat-header__info">
          <div 
            className="context-indicator"
            style={{ backgroundColor: contexts[chatContext].color }}
          >
            <span className="context-icon">
              {contexts[chatContext].name.split(' ')[0]}
            </span>
          </div>
          <div className="chat-header__text">
            <h3 className="chat-title">{contexts[chatContext].name}</h3>
            <p className="chat-subtitle">
              {user ? `Chatting as ${user.username}` : 'Anonymous session'}
            </p>
          </div>
        </div>
        
        <div className="chat-header__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            icon={<Settings size={16} />}
            title="Chat settings"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            icon={<RotateCcw size={16} />}
            title="Clear chat"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            icon={isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            title={isMinimized ? 'Restore' : 'Minimize'}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="chat-settings">
          <h4>Chat Context</h4>
          <div className="context-options">
            {Object.entries(contexts).map(([key, context]) => (
              <button
                key={key}
                className={`context-option ${chatContext === key ? 'active' : ''}`}
                onClick={() => handleContextChange(key)}
                style={{ borderColor: context.color }}
              >
                <span className="context-option__icon">
                  {context.name.split(' ')[0]}
                </span>
                <div className="context-option__text">
                  <span className="context-option__name">{context.name}</span>
                  <span className="context-option__desc">{context.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="chat-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button 
            className="error-close"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message message--${message.role} ${message.isError ? 'message--error' : ''}`}
          >
            <div className="message__content">
              <div className="message__text">{message.content}</div>
              <div className="message__meta">
                <span className="message__time">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.responseTime && (
                  <span className="message__response-time">
                    {message.responseTime}ms
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {typingIndicator && (
          <div className="message message--assistant message--typing">
            <div className="message__content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="message__text">Thinking...</div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${contexts[chatContext].name.toLowerCase()} anything...`}
            disabled={isLoading}
            rows={1}
            className="message-input"
          />
          
          <div className="input-actions">
            {recognitionRef.current && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceRecognition}
                icon={isListening ? <MicOff size={16} /> : <Mic size={16} />}
                className={isListening ? 'listening' : ''}
                title={isListening ? 'Stop listening' : 'Voice input'}
              />
            )}
            
            <Button
              variant="cosmic"
              size="sm"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              loading={isLoading}
              icon={<Send size={16} />}
              title="Send message"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatPanel;