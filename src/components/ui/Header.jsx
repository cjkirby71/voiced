import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useUser } from '../../context/UserContext';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  const navigationItems = [
    { label: 'Home', path: '/home-dashboard', icon: 'Home' },
    { label: 'News', path: '/journalism-hub', icon: 'Newspaper' },
    { label: 'Polls', path: '/polling-interface', icon: 'BarChart3' },
    { label: 'Feedback', path: '/community-feedback-hub', icon: 'MessageSquare' },
    { label: 'Profile', path: '/user-profile-representative-contact', icon: 'User' },
    { label: 'Subscribe', path: '/subscription-management', icon: 'CreditCard' }
  ];

  // Add admin dashboard link for admin users
  if (user?.role === 'admin') {
    navigationItems.push({ label: 'Admin', path: '/admin-dashboard', icon: 'Settings' });
  }

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Don't show header on login/registration screens
  if (location.pathname === '/login-screen' || location.pathname === '/registration-screen') {
    return null;
  }

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

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                  title="Logout"
                >
                  <Icon name="LogOut" size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login-screen"
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

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
              
              {/* Mobile User Menu */}
              {isAuthenticated && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                    <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-all duration-200 ease-out w-full"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;