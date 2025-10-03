import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Rocket } from 'lucide-react';
import Button from '../ui/Button';
import apiService from '../../services/api';
import './AuthModal.css';

const AuthModal = ({ 
  mode = 'login', 
  onClose, 
  onSuccess, 
  onError, 
  onSwitchMode 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  // Reset form when mode changes
  useEffect(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setStep(1);
  }, [mode]);

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'register') {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'register' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let response;
      
      if (mode === 'login') {
        response = await apiService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await apiService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }

      if (response.success) {
        onSuccess(response.data, response.token);
      } else {
        onError(response.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      onError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const switchMode = () => {
    onSwitchMode(mode === 'login' ? 'register' : 'login');
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          <Mail size={16} />
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter your email"
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          <Lock size={16} />
          Password
        </label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      <Button
        type="submit"
        variant="cosmic"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        Sign In to AGI Cosmic
      </Button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          <User size={16} />
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`form-input ${errors.username ? 'error' : ''}`}
          placeholder="Choose a username"
          disabled={isLoading}
          autoComplete="username"
        />
        {errors.username && <span className="form-error">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          <Mail size={16} />
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter your email"
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          <Lock size={16} />
          Password
        </label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Create a password"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          <Lock size={16} />
          Confirm Password
        </label>
        <div className="password-input">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm your password"
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
      </div>

      <Button
        type="submit"
        variant="cosmic"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        Join AGI Cosmic
      </Button>
    </form>
  );

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-modal__header">
          <div className="auth-logo">
            <div className="auth-logo__icon">
              <Rocket size={32} />
            </div>
            <div className="auth-logo__text">
              <h1>AGI Cosmic</h1>
              <p>Aerospace Intelligence Platform</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => onSwitchMode('login')}
              disabled={isLoading}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => onSwitchMode('register')}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="auth-modal__content">
          <div className="auth-welcome">
            <h2>
              {mode === 'login' 
                ? 'Welcome back, Space Explorer!' 
                : 'Join the Cosmic Journey!'
              }
            </h2>
            <p>
              {mode === 'login'
                ? 'Sign in to continue your exploration of the universe and chat with our AI about aerospace technology.'
                : 'Create your account to start exploring the solar system and unlock the full power of our AI assistant.'
              }
            </p>
          </div>

          {mode === 'login' ? renderLoginForm() : renderRegisterForm()}

          <div className="auth-footer">
            <p>
              {mode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <button 
                className="auth-switch" 
                onClick={switchMode}
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>

          <div className="auth-features">
            <h3>🌟 What you'll get:</h3>
            <ul>
              <li>🚀 Interactive 3D solar system exploration</li>
              <li>🤖 AI-powered aerospace knowledge assistant</li>
              <li>💬 Persistent chat history and sessions</li>
              <li>📊 Personal learning progress tracking</li>
              <li>🌌 Exclusive cosmic content and updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;