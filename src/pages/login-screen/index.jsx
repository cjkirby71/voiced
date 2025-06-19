// src/pages/login-screen/index.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import LoginForm from './components/LoginForm';
import SocialAuthButtons from './components/SocialAuthButtons';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (credentials) => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Mock validation
      if (credentials.email === 'demo@voiced.gov' && credentials.password === 'demo123') {
        setIsLoading(false);
        navigate('/home-dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleSocialAuth = (provider) => {
    setIsLoading(true);
    setError('');
    
    // Simulate social auth
    setTimeout(() => {
      console.log(`Authenticating with ${provider}`);
      setIsLoading(false);
      navigate('/home-dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200">
          <div className="bg-surface rounded-lg p-8 flex items-center space-x-4">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-text-primary font-medium">Signing in...</span>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Vote" size={32} color="white" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to access federal transparency tools
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-xl shadow-civic-lg border border-border p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-lg flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error-600" />
              <span className="text-error-600 text-sm">{error}</span>
            </div>
          )}

          {/* Demo Credentials Notice */}
          <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
            <p className="text-primary-700 text-sm font-medium mb-1">Demo Credentials:</p>
            <p className="text-primary-600 text-xs">Email: demo@voiced.gov</p>
            <p className="text-primary-600 text-xs">Password: demo123</p>
          </div>

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-text-muted text-sm">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Social Authentication */}
          <SocialAuthButtons onSocialAuth={handleSocialAuth} isLoading={isLoading} />

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <Link
              to="/forgot-password"
              className="block text-sm text-primary hover:text-primary-700 transition-colors duration-200"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-text-secondary">
              New to Voiced?{' '}
              <Link
                to="/registration-screen"
                className="text-primary hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Mission */}
        <div className="text-center pt-4">
          <p className="text-xs text-text-muted">
            Empowering citizens through government transparency
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;