import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { countryService } from '../services/api';
import { Country, AIResponse } from '../types';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 1rem;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  flex: 1;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: #c0392b;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  margin-bottom: 1rem;
`;

const Message = styled.div<{ isUser: boolean }>`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.isUser ? '#667eea' : '#f8f9fa'};
  color: ${props => props.isUser ? 'white' : '#333'};
  margin-left: ${props => props.isUser ? '20%' : '0'};
  margin-right: ${props => props.isUser ? '0' : '20%'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const CommandInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CountryInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const InfoTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  span:first-child {
    font-weight: 600;
    color: #555;
  }

  span:last-child {
    color: #333;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [country, setCountry] = useState<Country | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadCountry = async () => {
      try {
        const countryData = await countryService.getCountry();
        setCountry(countryData);
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now(),
          text: `Welcome, ${countryData.leader_title} of ${countryData.name}! Your nation of ${countryData.population.toLocaleString()} citizens awaits your leadership. Type a command to begin managing your country.`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Failed to load country:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCountry();
  }, []);

  const handleSendCommand = async () => {
    if (!command.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: command,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCommand('');
    setLoading(true);

    try {
      const response: AIResponse = await countryService.processCommand(command);
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: response.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Refresh country data if there were updates
      if (response.country_updates && Object.keys(response.country_updates).length > 0) {
        const updatedCountry = await countryService.getCountry();
        setCountry(updatedCountry);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your command. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (initialLoading) {
    return <LoadingText>Loading your nation...</LoadingText>;
  }

  if (!country) {
    return <LoadingText>Error loading country data</LoadingText>;
  }

  return (
    <Container>
      <Sidebar>
        <CountryInfo>
          <InfoTitle>{country.name}</InfoTitle>
          <InfoItem>
            <span>Leader:</span>
            <span>{country.leader_title}</span>
          </InfoItem>
          <InfoItem>
            <span>Population:</span>
            <span>{country.population.toLocaleString()}</span>
          </InfoItem>
          <InfoItem>
            <span>GDP:</span>
            <span>${formatNumber(country.gdp)}</span>
          </InfoItem>
          <InfoItem>
            <span>Territory:</span>
            <span>{formatNumber(country.territory_size)} km²</span>
          </InfoItem>
          <InfoItem>
            <span>Happiness:</span>
            <span>{country.happiness_index.toFixed(1)}/10</span>
          </InfoItem>
          <InfoItem>
            <span>Stability:</span>
            <span>{country.stability.toFixed(0)}%</span>
          </InfoItem>
          <InfoItem>
            <span>Military:</span>
            <span>{country.military_strength.toFixed(0)}/100</span>
          </InfoItem>
          <InfoItem>
            <span>Technology:</span>
            <span>{country.tech_level.toFixed(0)}/100</span>
          </InfoItem>
          <InfoItem>
            <span>Education:</span>
            <span>{country.education_index.toFixed(0)}/100</span>
          </InfoItem>
          <InfoItem>
            <span>Unemployment:</span>
            <span>{country.unemployment_rate.toFixed(1)}%</span>
          </InfoItem>
        </CountryInfo>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>AGI Cosmic - {user?.username}</Title>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </Header>

        <ChatContainer>
          <MessageArea>
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                {message.text}
              </Message>
            ))}
            {loading && (
              <Message isUser={false}>
                Processing your command...
              </Message>
            )}
            <div ref={messagesEndRef} />
          </MessageArea>

          <InputContainer>
            <CommandInput
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a command for your nation..."
              disabled={loading}
            />
            <SendButton onClick={handleSendCommand} disabled={loading || !command.trim()}>
              Send
            </SendButton>
          </InputContainer>
        </ChatContainer>
      </MainContent>
    </Container>
  );
};

export default Dashboard;