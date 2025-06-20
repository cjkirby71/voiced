// src/utils/errorRecovery.js
// Error recovery utilities for authentication issues
import supabase from './supabaseClient';
import authService from './authService';
import { debugLogger } from './debugUtils';

// Error types for categorization
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'authentication',
  JWT: 'jwt_token',
  REFRESH_TOKEN: 'refresh_token',
  DATABASE: 'database',
  PERMISSION: 'permission',
  VALIDATION: 'validation',
  UNKNOWN: 'unknown'
};

// Error categorizer
export const categorizeError = (error) => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code || '';
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
    return ERROR_TYPES.NETWORK;
  }
  
  // Refresh token specific errors
  if (errorMessage.includes('refresh token not found') || 
      errorMessage.includes('invalid refresh token') ||
      errorMessage.includes('refresh_token_not_found') ||
      errorMessage.includes('invalid_refresh_token')) {
    return ERROR_TYPES.REFRESH_TOKEN;
  }
  
  // Authentication errors
  if (errorMessage.includes('invalid_credentials') || errorMessage.includes('unauthorized') || errorCode === '401') {
    return ERROR_TYPES.AUTH;
  }
  
  // JWT specific errors
  if (errorMessage.includes('jwt') || errorMessage.includes('token') || errorMessage.includes('expired')) {
    return ERROR_TYPES.JWT;
  }
  
  // Database errors
  if (errorMessage.includes('database') || errorMessage.includes('sql') || errorCode?.startsWith('PG')) {
    return ERROR_TYPES.DATABASE;
  }
  
  // Permission errors
  if (errorMessage.includes('permission') || errorMessage.includes('access') || errorCode === '403') {
    return ERROR_TYPES.PERMISSION;
  }
  
  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid') || errorCode === '400') {
    return ERROR_TYPES.VALIDATION;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

// Recovery strategies for different error types
export const errorRecoveryStrategies = {
  [ERROR_TYPES.NETWORK]: {
    name: 'Network Error Recovery',
    steps: [
      'Check internet connection',
      'Retry request with exponential backoff',
      'Switch to offline mode if available',
      'Show network error message to user'
    ],
    autoRetry: true,
    maxRetries: 3
  },
  
  [ERROR_TYPES.AUTH]: {
    name: 'Authentication Error Recovery',
    steps: [
      'Clear stored authentication data',
      'Redirect to login page',
      'Show authentication error message',
      'Suggest password reset if applicable'
    ],
    autoRetry: false,
    maxRetries: 0
  },
  
  [ERROR_TYPES.REFRESH_TOKEN]: {
    name: 'Refresh Token Error Recovery',
    steps: [
      'Clear invalid refresh token from storage',
      'Clear all auth-related localStorage/sessionStorage',
      'Reset authentication state',
      'Redirect to login with appropriate message'
    ],
    autoRetry: false,
    maxRetries: 0
  },
  
  [ERROR_TYPES.JWT]: {
    name: 'JWT Token Error Recovery',
    steps: [
      'Attempt token refresh',
      'Re-exchange Supabase token for JWT',
      'Clear invalid token from storage',
      'Fallback to re-authentication'
    ],
    autoRetry: true,
    maxRetries: 2
  },
  
  [ERROR_TYPES.DATABASE]: {
    name: 'Database Error Recovery',
    steps: [
      'Retry database operation',
      'Check database connection',
      'Use cached data if available',
      'Show graceful error message'
    ],
    autoRetry: true,
    maxRetries: 2
  },
  
  [ERROR_TYPES.PERMISSION]: {
    name: 'Permission Error Recovery',
    steps: [
      'Check user tier and permissions',
      'Refresh user profile data',
      'Show upgrade prompt if applicable',
      'Redirect to appropriate content'
    ],
    autoRetry: false,
    maxRetries: 0
  },
  
  [ERROR_TYPES.VALIDATION]: {
    name: 'Validation Error Recovery',
    steps: [
      'Parse validation error details',
      'Show field-specific error messages',
      'Suggest corrections to user input',
      'Prevent form submission until fixed'
    ],
    autoRetry: false,
    maxRetries: 0
  },
  
  [ERROR_TYPES.UNKNOWN]: {
    name: 'Unknown Error Recovery',
    steps: [
      'Log error details for investigation',
      'Show generic error message',
      'Provide support contact information',
      'Attempt graceful degradation'
    ],
    autoRetry: false,
    maxRetries: 0
  }
};

// Enhanced error recovery class
class ErrorRecoveryManager {
  constructor() {
    this.retryAttempts = new Map();
    this.recoveryHistory = [];
  }
  
  // Main error handling method
  async handleError(error, context = {}) {
    const errorType = categorizeError(error);
    const strategy = errorRecoveryStrategies[errorType];
    const errorId = this.generateErrorId();
    
    debugLogger.error(`Error detected [${errorId}]:`, {
      type: errorType,
      message: error.message,
      context
    });
    
    // Log to recovery history
    this.recoveryHistory.push({
      id: errorId,
      timestamp: new Date().toISOString(),
      type: errorType,
      error: error.message,
      context,
      strategy: strategy.name
    });
    
    // Attempt recovery
    if (strategy.autoRetry && this.canRetry(errorId, strategy.maxRetries)) {
      return await this.attemptRecovery(errorId, errorType, error, context);
    }
    
    // Manual recovery or show error to user
    return this.handleManualRecovery(errorType, error, context);
  }
  
  // Check if we can retry this error
  canRetry(errorId, maxRetries) {
    const attempts = this.retryAttempts.get(errorId) || 0;
    return attempts < maxRetries;
  }
  
  // Attempt automatic recovery
  async attemptRecovery(errorId, errorType, error, context) {
    const attempts = this.retryAttempts.get(errorId) || 0;
    this.retryAttempts.set(errorId, attempts + 1);
    
    debugLogger.info(`Attempting recovery for ${errorType} (attempt ${attempts + 1})`);
    
    try {
      switch (errorType) {
        case ERROR_TYPES.NETWORK:
          return await this.recoverNetworkError(error, context);
        case ERROR_TYPES.REFRESH_TOKEN:
          return await this.recoverRefreshTokenError(error, context);
        case ERROR_TYPES.JWT:
          return await this.recoverJWTError(error, context);
        case ERROR_TYPES.DATABASE:
          return await this.recoverDatabaseError(error, context);
        default:
          return this.handleManualRecovery(errorType, error, context);
      }
    } catch (recoveryError) {
      debugLogger.error('Recovery attempt failed:', recoveryError);
      return this.handleManualRecovery(errorType, error, context);
    }
  }
  
  // Network error recovery
  async recoverNetworkError(error, context) {
    // Wait before retry with exponential backoff
    const attempt = this.retryAttempts.get(this.generateErrorId()) || 1;
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
    
    debugLogger.info(`Retrying network request after ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the original operation if provided in context
    if (context.retryFunction) {
      return await context.retryFunction();
    }
    
    return { recovered: false, error: 'Network retry function not provided' };
  }
  
  // Refresh token error recovery
  async recoverRefreshTokenError(error, context) {
    debugLogger.info('Attempting refresh token error recovery');
    
    try {
      // Clear all authentication data from storage
      this.clearAuthStorage();
      
      // Reset Supabase auth state
      await supabase.auth.signOut({ scope: 'local' });
      
      debugLogger.info('Authentication state cleared due to refresh token error');
      
      return {
        recovered: false,
        requiresReauth: true,
        clearAuth: true,
        userMessage: 'Your session has expired. Please sign in again to continue.',
        redirectTo: '/login-screen'
      };
    } catch (recoveryError) {
      debugLogger.error('Refresh token recovery exception:', recoveryError);
      return {
        recovered: false,
        requiresReauth: true,
        clearAuth: true,
        userMessage: 'Authentication error. Please sign in again.',
        redirectTo: '/login-screen'
      };
    }
  }
  
  // Clear authentication storage
  clearAuthStorage() {
    try {
      // Clear localStorage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes('supabase') || key?.includes('auth') || key?.includes('jwt')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage items
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.includes('supabase') || key?.includes('auth') || key?.includes('jwt')) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      debugLogger.info('Auth storage cleared successfully');
    } catch (error) {
      debugLogger.error('Error clearing auth storage:', error);
    }
  }
  
  // JWT error recovery
  async recoverJWTError(error, context) {
    debugLogger.info('Attempting JWT token recovery');
    
    try {
      // First try to refresh the Supabase session
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        debugLogger.warn('Session refresh failed, attempting re-authentication');
        return { recovered: false, requiresReauth: true };
      }
      
      // If session refresh successful, try JWT exchange again
      const jwtResult = await authService.exchangeForJWT();
      
      if (jwtResult.success) {
        debugLogger.info('JWT recovery successful');
        return { recovered: true, newToken: jwtResult.data };
      } else {
        debugLogger.error('JWT exchange failed during recovery:', jwtResult.error);
        return { recovered: false, requiresReauth: true };
      }
    } catch (recoveryError) {
      debugLogger.error('JWT recovery exception:', recoveryError);
      return { recovered: false, requiresReauth: true };
    }
  }
  
  // Database error recovery
  async recoverDatabaseError(error, context) {
    debugLogger.info('Attempting database error recovery');
    
    // Check if this is a connection issue
    if (error.message?.includes('connection') || error.message?.includes('timeout')) {
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (context.retryFunction) {
        try {
          const result = await context.retryFunction();
          debugLogger.info('Database recovery successful');
          return { recovered: true, data: result };
        } catch (retryError) {
          debugLogger.error('Database retry failed:', retryError);
          return { recovered: false, error: retryError.message };
        }
      }
    }
    
    return { recovered: false, error: 'Database recovery not possible' };
  }
  
  // Handle errors that require manual intervention
  handleManualRecovery(errorType, error, context) {
    const strategy = errorRecoveryStrategies[errorType];
    
    debugLogger.warn(`Manual recovery required for ${errorType}:`, {
      error: error.message,
      strategy: strategy.steps
    });
    
    return {
      recovered: false,
      requiresManualIntervention: true,
      errorType,
      strategy,
      userMessage: this.generateUserMessage(errorType, error),
      technicalDetails: {
        error: error.message,
        context,
        recoverySteps: strategy.steps
      }
    };
  }
  
  // Generate user-friendly error messages
  generateUserMessage(errorType, error) {
    switch (errorType) {
      case ERROR_TYPES.NETWORK:
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case ERROR_TYPES.AUTH:
        return 'Your session has expired. Please sign in again to continue.';
      case ERROR_TYPES.REFRESH_TOKEN:
        return 'Your session has expired and cannot be refreshed. Please sign in again to continue.';
      case ERROR_TYPES.JWT:
        return 'Authentication token expired. Please refresh the page or sign in again.';
      case ERROR_TYPES.DATABASE:
        return 'Unable to load data at this time. Please try again in a moment.';
      case ERROR_TYPES.PERMISSION:
        return 'You do not have permission to access this content. Consider upgrading your account.';
      case ERROR_TYPES.VALIDATION:
        return 'Please check your input and try again.';
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  }
  
  // Generate unique error ID
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Get recovery history
  getRecoveryHistory() {
    return this.recoveryHistory;
  }
  
  // Clear recovery history
  clearRecoveryHistory() {
    this.recoveryHistory = [];
    this.retryAttempts.clear();
  }
}

// Create singleton instance
const errorRecoveryManager = new ErrorRecoveryManager();

// Enhanced error wrapper for async functions
export const withErrorRecovery = (asyncFunction, context = {}) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      const recoveryResult = await errorRecoveryManager.handleError(error, {
        ...context,
        functionName: asyncFunction.name,
        arguments: args,
        retryFunction: () => asyncFunction(...args)
      });
      
      if (recoveryResult.recovered) {
        return recoveryResult.data || recoveryResult.newToken;
      }
      
      // If recovery failed, throw enhanced error
      const enhancedError = new Error(recoveryResult.userMessage || error.message);
      enhancedError.originalError = error;
      enhancedError.recoveryResult = recoveryResult;
      enhancedError.errorType = categorizeError(error);
      
      throw enhancedError;
    }
  };
};

// Export singleton instance
export default errorRecoveryManager;
export { ErrorRecoveryManager };