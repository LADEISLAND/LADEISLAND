import React, { useState, useEffect } from 'react';
import { SolarSystem } from './components/SolarSystem';
import EnhancedChatPanel from './components/chat/EnhancedChatPanel';
import Header from './components/layout/Header';
import AuthModal from './components/auth/AuthModal';
import LoadingScreen from './components/ui/LoadingScreen';
import apiService from './services/api';
import './App.css';
import './styles/globals.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [error, setError] = useState(null);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is already logged in
      const token = localStorage.getItem('token');
      if (token) {
        apiService.setToken(token);
        const response = await apiService.getMe();
        if (response.success) {
          setUser(response.data);
        } else {
          // Invalid token, remove it
          localStorage.removeItem('token');
          apiService.setToken(null);
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Clear invalid token
      localStorage.removeItem('token');
      apiService.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    apiService.setToken(token);
    setShowAuthModal(false);
    setError(null);
  };

  const handleAuthError = (errorMessage) => {
    setError(errorMessage);
  };

  const handlePlanetClick = (planetName, planetInfo) => {
    setSelectedPlanet({ name: planetName, info: planetInfo });
    // Auto-open chat if minimized when planet is clicked
    if (isChatMinimized) {
      setIsChatMinimized(false);
    }
  };

  const toggleChatMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      {/* Header */}
      <Header
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="app__main">
        {/* 3D Solar System */}
        <SolarSystem onPlanetClick={handlePlanetClick} />

        {/* Enhanced Chat Panel */}
        <EnhancedChatPanel
          user={user}
          isMinimized={isChatMinimized}
          onToggleMinimize={toggleChatMinimize}
          onPlanetContext={selectedPlanet}
        />
      </main>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          onError={handleAuthError}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      {/* Global Error Display */}
      {error && (
        <div className="global-error">
          <div className="global-error__content">
            <span className="global-error__icon">⚠️</span>
            <span className="global-error__text">{error}</span>
            <button 
              className="global-error__close"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Welcome Tour for New Users */}
      {user && !user.hasCompletedTour && (
        <div className="welcome-tour">
          <div className="welcome-tour__content">
            <h2>🚀 Welcome to AGI Cosmic!</h2>
            <p>Explore the solar system and chat with our AI assistant about space, aerospace technology, and cosmic phenomena.</p>
            <div className="welcome-tour__actions">
              <button 
                className="btn btn--cosmic"
                onClick={() => setUser({...user, hasCompletedTour: true})}
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}