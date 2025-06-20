// src/pages/login-screen/index.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './components/LoginForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import AppImage from '../../components/AppImage';

function LoginScreen() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionMessage, setSessionMessage] = useState('');

  // Handle session expiration message
  useEffect(() => {
    if (location?.state?.message) {
      setSessionMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.message, navigate, location.pathname]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/home-dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">
              Welcome Back to Voiced
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with your representatives, participate in polls, and stay informed about the issues that matter to you.
            </p>
            <div className="w-64 h-48 mx-auto rounded-lg overflow-hidden shadow-2xl">
              <AppImage 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=center"
                alt="Democratic participation"
                className="w-full h-full object-cover"
                fallbackSrc="https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?w=400&h=300&fit=crop&crop=center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600">
              Access your Voiced account to continue
            </p>
            
            {/* Session expiration message */}
            {sessionMessage && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800">{sessionMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Auth */}
          <SocialAuthButtons />

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/registration-screen')}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign up here
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Having trouble? Check our{' '}
              <button
                onClick={() => navigate('/authentication-setup-guide')}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                authentication guide
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;