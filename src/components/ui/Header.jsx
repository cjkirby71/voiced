import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', path: '/home-dashboard', icon: 'Home' },
    { label: 'News', path: '/journalism-hub', icon: 'Newspaper' },
    { label: 'Polls', path: '/polling-interface', icon: 'BarChart3' },
    { label: 'Feedback', path: '/community-feedback-hub', icon: 'MessageSquare' },
    { label: 'Profile', path: '/user-profile-representative-contact', icon: 'User' },
    { label: 'Subscribe', path: '/subscription-management', icon: 'CreditCard' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home-dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Vote" size={20} color="white" />
              </div>
              <div className="font-heading font-bold text-xl text-text-primary">
                Voiced
                <span className="text-sm font-normal text-text-secondary ml-2">
                  Your Voice in Government
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out flex items-center space-x-2 ${
                  isActivePath(item.path)
                    ? 'bg-primary text-white shadow-civic'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <nav className="py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
                    isActivePath(item.path)
                      ? 'bg-primary text-white shadow-civic'
                      : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;