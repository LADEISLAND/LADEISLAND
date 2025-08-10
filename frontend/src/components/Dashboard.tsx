import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Users, 
  Shield, 
  TrendingUp, 
  Zap, 
  Send, 
  LogOut,
  MapPin,
  Activity
} from 'lucide-react';
import { Country, CommandResponse } from '../types';
import { countryAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CountryCreateModal from './CountryCreateModal';

const Dashboard: React.FC = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string; timestamp: Date }>>([]);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadCountry();
  }, []);

  const loadCountry = async () => {
    try {
      const countryData = await countryAPI.getCountry();
      setCountry(countryData);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setShowCreateModal(true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const userMessage = command;
    setCommand('');
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response: CommandResponse = await countryAPI.processCommand(userMessage);
      setCountry(response.country_state);
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.response,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: error.response?.data?.detail || 'An error occurred while processing your command.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryCreated = (newCountry: Country) => {
    setCountry(newCountry);
    setShowCreateModal(false);
  };

  if (!country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your country...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Crown className="h-8 w-8 text-cosmic-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AGI Cosmic</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Country Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="h-6 w-6 text-cosmic-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{country.name}</h2>
                  <p className="text-sm text-gray-500">Led by {country.leader_title}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Population</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{country.population.toLocaleString()}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Economy</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{country.economy_score.toFixed(1)}</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Military</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900">{country.military_strength}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Technology</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">Level {country.technology_level}</p>
                </div>
              </div>

              {/* Resources */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Resources</h3>
                <div className="space-y-2">
                  {Object.entries(country.resources).map(([resource, amount]) => (
                    <div key={resource} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{resource}</span>
                      <span className="font-medium">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alliances */}
              {country.alliances.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Alliances</h3>
                  <div className="flex flex-wrap gap-2">
                    {country.alliances.map((alliance, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cosmic-100 text-cosmic-800"
                      >
                        {alliance}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Command Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-cosmic-600" />
                  <h3 className="text-lg font-medium text-gray-900">Command Center</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Give natural language commands to manage your country
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Start by giving a command to manage your country</p>
                    <p className="text-sm mt-2">Try: "Increase military spending" or "Build new schools"</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-cosmic-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span className="text-sm">Processing command...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Command Input */}
              <div className="border-t p-6">
                <form onSubmit={handleCommand} className="flex space-x-4">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter your command..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !command.trim()}
                    className="px-6 py-2 bg-cosmic-600 text-white rounded-lg hover:bg-cosmic-700 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Creation Modal */}
      {showCreateModal && (
        <CountryCreateModal
          onClose={() => setShowCreateModal(false)}
          onCountryCreated={handleCountryCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;