// src/pages/authentication-callback-handler/index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppIcon from '../../components/AppIcon';

const AuthenticationCallbackHandler = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { exchangeCodeForSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let progressInterval = null;

    // Start progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');

        // Handle error cases first
        if (error) {
          let userMessage = 'Authentication failed. Please try again.';
          
          if (errorCode === 'otp_expired' || error === 'access_denied') {
            userMessage = 'Your verification link has expired. Please sign up again to receive a new link.';
          } else if (errorDescription) {
            userMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '));
          }
          
          console.log('Auth callback error:', { error, errorCode, errorDescription });
          
          if (isMounted) {
            clearInterval(progressInterval);
            setProgress(100);
            setError(userMessage);
            setStatus('error');
          }
          return;
        }

        // Handle successful code exchange
        if (code) {
          console.log('Processing authorization code...');
          setProgress(50);
          
          // Exchange code for session using the enhanced function
          const result = await exchangeCodeForSession(code);
          
          if (result?.success && isMounted) {
            console.log('Authorization code exchange successful');
            clearInterval(progressInterval);
            setProgress(100);
            setStatus('success');
            
            // Redirect to home dashboard after successful authentication
            setTimeout(() => {
              if (isMounted) {
                navigate('/home-dashboard', { replace: true });
              }
            }, 2000);
          } else if (isMounted) {
            console.log('Authorization code exchange failed:', result?.error);
            clearInterval(progressInterval);
            setError(result?.error || 'Failed to process authentication. Please try again.');
            setStatus('error');
          }
        } else {
          // No code or error found - redirect to login
          if (isMounted) {
            console.log('No authorization code found, redirecting to login');
            clearInterval(progressInterval);
            navigate('/login-screen', { replace: true });
          }
        }
      } catch (error) {
        console.log('Auth callback processing error:', error);
        if (isMounted) {
          clearInterval(progressInterval);
          setError('Something went wrong processing your authentication. Please try again.');
          setStatus('error');
        }
      }
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [location.search, navigate, exchangeCodeForSession]);

  const handleRetry = () => {
    navigate('/registration-screen', { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate('/login-screen', { replace: true });
  };

  const handleHomeRedirect = () => {
    navigate('/home-dashboard', { replace: true });
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Voiced Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <AppIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Loading Animation */}
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating Your Account</h2>
            <p className="text-gray-600 mb-6">Please wait while we securely verify your magic link and set up your Voiced account...</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {progress < 30 ? 'Verifying magic link...' : 
               progress < 70 ? 'Exchanging authorization code...': 'Setting up your session...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Voiced!</h2>
            <p className="text-gray-600 mb-6">Your account has been successfully authenticated. You're being redirected to your dashboard...</p>
            
            {/* Success Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full w-full animate-pulse"></div>
            </div>
            
            <button
              onClick={handleHomeRedirect}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            
            {/* Error Recovery Options */}
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Try Sign Up Again
              </button>
              <button
                onClick={handleLoginRedirect}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Go to Login
              </button>
            </div>
            
            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If you continue to experience issues, please contact our support team or try using a different browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthenticationCallbackHandler;