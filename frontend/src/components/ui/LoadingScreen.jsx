import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Loading AGI Cosmic...' }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Animated Solar System Loader */}
        <div className="solar-loader">
          <div className="sun">
            <div className="sun-core"></div>
            <div className="sun-rays">
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
              <div className="ray"></div>
            </div>
          </div>
          
          <div className="orbit orbit-1">
            <div className="planet planet-1"></div>
          </div>
          
          <div className="orbit orbit-2">
            <div className="planet planet-2"></div>
          </div>
          
          <div className="orbit orbit-3">
            <div className="planet planet-3"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <h1 className="loading-title">
            <span className="title-icon">🚀</span>
            AGI Cosmic
          </h1>
          <p className="loading-message">{message}</p>
          
          {/* Progress Dots */}
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-text">
            <span>Initializing aerospace intelligence systems</span>
          </div>
        </div>
      </div>

      {/* Background Stars */}
      <div className="loading-stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;