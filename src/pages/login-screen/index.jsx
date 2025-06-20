// src/pages/login-screen/index.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import Icon from 'components/AppIcon';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/home-dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign In - Voiced</title>
        <meta name="description" content="Sign in to your Voiced account to access polls, articles, and connect with your representatives." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Vote" size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Welcome back to Voiced
            </h2>
            <p className="text-text-muted">
              Sign in to your account to continue engaging with your community
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-surface p-8 rounded-xl shadow-sm border border-border">
            <LoginForm />

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-muted">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Auth */}
            <div className="mt-6">
              <SocialAuthButtons />
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-text-muted">
                Do not have an account?{' '}
                <Link 
                  to="/registration-screen" 
                  className="font-medium text-primary hover:text-primary-700 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-primary hover:text-primary-700 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Help Text */}
          <div className="text-center">
            <p className="text-xs text-text-muted">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:text-primary-700 underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:text-primary-700 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;