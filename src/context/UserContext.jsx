// src/context/UserContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null,
  userRole: null, // 'admin', 'user', 'moderator'
  permissions: [],
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en'
  }
};

// Action types
const USER_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_USER: 'RESTORE_USER'
};

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case USER_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lastLoginTime: new Date().toISOString(),
        userRole: action.payload.user?.role || 'user',
        permissions: action.payload.user?.permissions || []
      };
    
    case USER_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        loginAttempts: state.loginAttempts + 1,
        isAuthenticated: false,
        user: null
      };
    
    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
        preferences: state.preferences // Preserve user preferences
      };
    
    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };
    
    case USER_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case USER_ACTIONS.RESTORE_USER:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Restore user session on app load
  useEffect(() => {
    const restoreUserSession = () => {
      try {
        const savedUser = localStorage.getItem('voiced_user');
        const savedAuth = localStorage.getItem('voiced_auth');
        const savedPrefs = localStorage.getItem('voiced_preferences');
        
        if (savedUser && savedAuth === 'true') {
          const user = JSON.parse(savedUser);
          const preferences = savedPrefs ? JSON.parse(savedPrefs) : initialState.preferences;
          
          dispatch({
            type: USER_ACTIONS.RESTORE_USER,
            payload: {
              user,
              isAuthenticated: true,
              userRole: user?.role || 'user',
              permissions: user?.permissions || [],
              preferences
            }
          });
        }
      } catch (error) {
        console.error('Error restoring user session:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('voiced_user');
        localStorage.removeItem('voiced_auth');
        localStorage.removeItem('voiced_preferences');
      }
    };

    restoreUserSession();
  }, []);

  // Persist user data to localStorage
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      localStorage.setItem('voiced_user', JSON.stringify(state.user));
      localStorage.setItem('voiced_auth', 'true');
      localStorage.setItem('voiced_preferences', JSON.stringify(state.preferences));
    } else {
      localStorage.removeItem('voiced_user');
      localStorage.removeItem('voiced_auth');
      localStorage.removeItem('voiced_preferences');
    }
  }, [state.isAuthenticated, state.user, state.preferences]);

  // Action creators
  const login = async (credentials) => {
    dispatch({ type: USER_ACTIONS.LOGIN_START });
    
    try {
      // Mock API call - replace with actual API integration
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'demo@voiced.gov' && credentials.password === 'demo123') {
            resolve({
              user: {
                id: '1',
                email: 'demo@voiced.gov',
                name: 'Demo User',
                role: 'admin',
                permissions: ['read', 'write', 'admin'],
                avatar: null,
                department: 'System Administration',
                lastLogin: new Date().toISOString()
              }
            });
          } else if (credentials.email === 'user@voiced.gov' && credentials.password === 'user123') {
            resolve({
              user: {
                id: '2',
                email: 'user@voiced.gov',
                name: 'Regular User',
                role: 'user',
                permissions: ['read'],
                avatar: null,
                department: 'Public',
                lastLogin: new Date().toISOString()
              }
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1500);
      });
      
      dispatch({ 
        type: USER_ACTIONS.LOGIN_SUCCESS, 
        payload: response 
      });
      
      return { success: true, user: response.user };
    } catch (error) {
      dispatch({ 
        type: USER_ACTIONS.LOGIN_FAILURE, 
        payload: { error: error.message } 
      });
      
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: USER_ACTIONS.LOGOUT });
  };

  const updateUser = (userData) => {
    dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: userData });
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
  };

  const clearError = () => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  };

  // Helper functions
  const hasPermission = (permission) => {
    return state.permissions?.includes(permission) || false;
  };

  const isAdmin = () => {
    return state.userRole === 'admin';
  };

  const isModerator = () => {
    return state.userRole === 'moderator' || state.userRole === 'admin';
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    updateUser,
    updatePreferences,
    clearError,
    
    // Helper functions
    hasPermission,
    isAdmin,
    isModerator
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;