// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Initial state
const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authMethod: null, // 'email', 'magic_link', 'oauth'
  loginAttempts: 0,
  lastLoginTime: null,
  authCallbackData: null
};

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CALLBACK_DATA: 'SET_CALLBACK_DATA',
  CLEAR_CALLBACK_DATA: 'CLEAR_CALLBACK_DATA'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authMethod: action.payload.method || null,
        loginAttempts: 0,
        lastLoginTime: new Date().toISOString()
      };
    
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        loginAttempts: state.loginAttempts + 1,
        isAuthenticated: false,
        user: null,
        session: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState
      };
    
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.SET_CALLBACK_DATA:
      return {
        ...state,
        authCallbackData: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_CALLBACK_DATA:
      return {
        ...state,
        authCallbackData: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedUser = localStorage.getItem('voiced_auth_user');
        const savedSession = localStorage.getItem('voiced_auth_session');
        const savedAuth = localStorage.getItem('voiced_auth_status');
        
        if (savedUser && savedSession && savedAuth === 'authenticated') {
          const user = JSON.parse(savedUser);
          const session = JSON.parse(savedSession);
          
          // Check if session is still valid (basic check)
          const sessionExpiry = new Date(session?.expires_at || 0);
          const now = new Date();
          
          if (sessionExpiry > now) {
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: {
                user,
                session,
                isAuthenticated: true,
                authMethod: session?.method || 'restored'
              }
            });
          } else {
            // Clear expired session
            localStorage.removeItem('voiced_auth_user');
            localStorage.removeItem('voiced_auth_session');
            localStorage.removeItem('voiced_auth_status');
          }
        }
      } catch (error) {
        console.error('Error restoring auth session:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('voiced_auth_user');
        localStorage.removeItem('voiced_auth_session');
        localStorage.removeItem('voiced_auth_status');
      }
    };

    restoreSession();
  }, []);

  // Persist auth data to localStorage
  useEffect(() => {
    if (state.isAuthenticated && state.user && state.session) {
      localStorage.setItem('voiced_auth_user', JSON.stringify(state.user));
      localStorage.setItem('voiced_auth_session', JSON.stringify(state.session));
      localStorage.setItem('voiced_auth_status', 'authenticated');
    } else {
      localStorage.removeItem('voiced_auth_user');
      localStorage.removeItem('voiced_auth_session');
      localStorage.removeItem('voiced_auth_status');
    }
  }, [state.isAuthenticated, state.user, state.session]);

  // Action creators
  const signIn = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      // Mock authentication - replace with actual authentication service
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'demo@voiced.gov' && credentials.password === 'demo123') {
            resolve({
              user: {
                id: '1',
                email: 'demo@voiced.gov',
                name: 'Demo User',
                role: 'admin',
                avatar: null,
                created_at: new Date().toISOString()
              },
              session: {
                access_token: 'mock_access_token_' + Date.now(),
                refresh_token: 'mock_refresh_token_' + Date.now(),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                method: 'email'
              }
            });
          } else if (credentials.email === 'user@voiced.gov' && credentials.password === 'user123') {
            resolve({
              user: {
                id: '2',
                email: 'user@voiced.gov',
                name: 'Regular User',
                role: 'user',
                avatar: null,
                created_at: new Date().toISOString()
              },
              session: {
                access_token: 'mock_access_token_' + Date.now(),
                refresh_token: 'mock_refresh_token_' + Date.now(),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                method: 'email'
              }
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1500);
      });
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: {
          user: response.user,
          session: response.session,
          method: 'email'
        }
      });
      
      return { success: true, user: response.user };
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: { error: error.message } 
      });
      
      return { success: false, error: error.message };
    }
  };

  const signInWithMagicLink = async (email) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      // Mock magic link sending - replace with actual service
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && email.includes('@')) {
            resolve({
              message: 'Magic link sent to your email',
              email: email
            });
          } else {
            reject(new Error('Invalid email address'));
          }
        }, 2000);
      });
      
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      return { success: true, message: response.message };
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: { error: error.message } 
      });
      
      return { success: false, error: error.message };
    }
  };

  const signUp = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      // Mock registration - replace with actual service
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (userData.email && userData.password && userData.name) {
            resolve({
              user: {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name,
                role: 'user',
                avatar: null,
                created_at: new Date().toISOString()
              },
              session: {
                access_token: 'mock_access_token_' + Date.now(),
                refresh_token: 'mock_refresh_token_' + Date.now(),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                method: 'email'
              }
            });
          } else {
            reject(new Error('Missing required fields'));
          }
        }, 2000);
      });
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: {
          user: response.user,
          session: response.session,
          method: 'email'
        }
      });
      
      return { success: true, user: response.user };
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: { error: error.message } 
      });
      
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      // Clear any server-side session if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      return { success: true };
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force logout even if there's an error
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const setCallbackData = (data) => {
    dispatch({ type: AUTH_ACTIONS.SET_CALLBACK_DATA, payload: data });
  };

  const clearCallbackData = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_CALLBACK_DATA });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    signIn,
    signInWithMagicLink,
    signUp,
    signOut,
    clearError,
    setCallbackData,
    clearCallbackData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthCallback component for handling authentication callbacks
export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCallbackData, clearError } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Processing callback');
        console.log('AuthCallback: Current URL:', window.location.href);
        console.log('AuthCallback: Location search:', location.search);
        
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error_code = urlParams.get('error');
        const error_description = urlParams.get('error_description');
        
        if (error_code) {
          console.error('AuthCallback: Error in URL params:', { error_code, error_description });
          setError(error_description || 'Authentication failed');
          setIsProcessing(false);
          
          // Redirect to login after delay
          setTimeout(() => {
            const errorMessage = encodeURIComponent(error_description || 'Authentication failed');
            navigate(`/login-screen?error=${errorMessage}`, { replace: true });
          }, 3000);
          return;
        }
        
        if (code) {
          console.log('AuthCallback: Found auth code, processing...');
          
          // Mock processing of auth code - replace with actual authentication service
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock successful authentication
          const mockUser = {
            id: 'magic_' + Date.now(),
            email: 'magic.user@voiced.gov',
            name: 'Magic Link User',
            role: 'user',
            avatar: null,
            created_at: new Date().toISOString()
          };
          
          const mockSession = {
            access_token: 'magic_token_' + Date.now(),
            refresh_token: 'magic_refresh_' + Date.now(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            method: 'magic_link'
          };
          
          // Store auth data
          setCallbackData({ user: mockUser, session: mockSession });
          
          setSuccess(true);
          setIsProcessing(false);
          
          console.log('AuthCallback: Authentication successful, redirecting...');
          
          // Redirect to dashboard after success
          setTimeout(() => {
            navigate('/home-dashboard', { replace: true });
          }, 2000);
        } else {
          console.log('AuthCallback: No auth code found, redirecting to login');
          setIsProcessing(false);
          
          // No code found, redirect to login
          setTimeout(() => {
            navigate('/login-screen', { replace: true });
          }, 1000);
        }
      } catch (err) {
        console.error('AuthCallback: Error processing callback:', err);
        setError(err.message || 'An unexpected error occurred');
        setIsProcessing(false);
        
        setTimeout(() => {
          const errorMessage = encodeURIComponent(err.message || 'Authentication failed');
          navigate(`/login-screen?error=${errorMessage}`, { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [location.search, navigate, setCallbackData]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Processing Authentication...</h2>
          <p className="text-text-secondary">Please wait while we complete your sign-in.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Authentication Failed</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <p className="text-sm text-text-secondary">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Authentication Successful!</h2>
          <p className="text-text-secondary mb-4">Welcome to Voiced! You're being redirected to your dashboard.</p>
          <p className="text-sm text-text-secondary">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;