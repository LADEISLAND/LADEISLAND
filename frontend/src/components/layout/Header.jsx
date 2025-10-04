import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import './Header.css';

const Header = ({ user, onLogin, onLogout, onRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Explore', href: '#explore', icon: '🌌' },
    { label: 'Chat', href: '#chat', icon: '💬' },
    { label: 'Learn', href: '#learn', icon: '📚' },
    { label: 'About', href: '#about', icon: 'ℹ️' }
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <div className="logo">
            <div className="logo__icon">
              <span className="logo__symbol">🚀</span>
            </div>
            <div className="logo__text">
              <span className="logo__title">AGI Cosmic</span>
              <span className="logo__subtitle">Aerospace Intelligence</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <ul className="nav__list">
            {navigationItems.map((item) => (
              <li key={item.label} className="nav__item">
                <a href={item.href} className="nav__link">
                  <span className="nav__icon">{item.icon}</span>
                  <span className="nav__text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Actions */}
        <div className="header__actions">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user.profile?.avatar ? (
                    <img src={user.profile.avatar} alt={user.username} />
                  ) : (
                    <span className="user-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.username}</span>
                  <span className="user-status">Online</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                icon={<LogoutIcon />}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogin}
              >
                Login
              </Button>
              <Button
                variant="cosmic"
                size="sm"
                onClick={onRegister}
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'hamburger--active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-nav">
          <ul className="mobile-nav__list">
            {navigationItems.map((item) => (
              <li key={item.label} className="mobile-nav__item">
                <a
                  href={item.href}
                  className="mobile-nav__link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-nav__icon">{item.icon}</span>
                  <span className="mobile-nav__text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          
          {!user && (
            <div className="mobile-auth">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button
                variant="cosmic"
                fullWidth
                onClick={() => {
                  onRegister();
                  setIsMobileMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

// Icons
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default Header;