// src/utils/debugUtils.js
// Debug utilities for authentication troubleshooting
import supabase from './supabaseClient';
import authService from './authService';

// Debug configuration
const DEBUG_CONFIG = {
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  enableConsoleLogging: true,
  enableNetworkLogging: true,
  enableAuthStateLogging: true
};

// Enhanced logging utility
export const debugLogger = {
  debug: (message, data = null) => {
    if (DEBUG_CONFIG.enableConsoleLogging && ['debug'].includes(DEBUG_CONFIG.logLevel)) {
      console.log(`🔍 [AUTH_DEBUG] ${message}`, data || '');
    }
  },
  
  info: (message, data = null) => {
    if (DEBUG_CONFIG.enableConsoleLogging && ['debug', 'info'].includes(DEBUG_CONFIG.logLevel)) {
      console.log(`ℹ️ [AUTH_INFO] ${message}`, data || '');
    }
  },
  
  warn: (message, data = null) => {
    if (DEBUG_CONFIG.enableConsoleLogging && ['debug', 'info', 'warn'].includes(DEBUG_CONFIG.logLevel)) {
      console.warn(`⚠️ [AUTH_WARN] ${message}`, data || '');
    }
  },
  
  error: (message, data = null) => {
    if (DEBUG_CONFIG.enableConsoleLogging) {
      console.error(`❌ [AUTH_ERROR] ${message}`, data || '');
    }
  },
  
  network: (url, method, status, response = null) => {
    if (DEBUG_CONFIG.enableNetworkLogging) {
      console.log(`🌐 [NETWORK] ${method} ${url} - Status: ${status}`, response || '');
    }
  }
};

// Authentication diagnostics
export const authDiagnostics = {
  // Check environment configuration
  checkEnvironment: () => {
    debugLogger.info('Checking environment configuration...');
    
    const checks = {
      supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      supabaseUrlFormat: import.meta.env.VITE_SUPABASE_URL?.startsWith('https://'),
      environment: import.meta.env.MODE
    };
    
    debugLogger.info('Environment checks:', checks);
    
    const issues = [];
    if (!checks.supabaseUrl) issues.push('VITE_SUPABASE_URL not set');
    if (!checks.supabaseAnonKey) issues.push('VITE_SUPABASE_ANON_KEY not set');
    if (!checks.supabaseUrlFormat) issues.push('VITE_SUPABASE_URL invalid format');
    
    return { checks, issues, passed: issues.length === 0 };
  },
  
  // Test Supabase connection
  testConnection: async () => {
    debugLogger.info('Testing Supabase connection...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        debugLogger.error('Connection test failed:', error);
        return { success: false, error: error.message };
      }
      
      debugLogger.info('Connection test passed:', { hasSession: !!data.session });
      return { success: true, hasSession: !!data.session };
    } catch (error) {
      debugLogger.error('Connection test exception:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Test edge functions
  testEdgeFunctions: async () => {
    debugLogger.info('Testing edge functions...');
    
    const results = {
      jwtExchange: { available: false, error: null },
      jwtValidate: { available: false, error: null }
    };
    
    try {
      // Test JWT exchange function
      const { data, error } = await supabase.functions.invoke('jwt-exchange', {
        body: { test: true }
      });
      
      if (error) {
        results.jwtExchange.error = error.message;
        debugLogger.warn('JWT Exchange function not available:', error);
      } else {
        results.jwtExchange.available = true;
        debugLogger.info('JWT Exchange function available');
      }
    } catch (error) {
      results.jwtExchange.error = error.message;
      debugLogger.error('JWT Exchange function test failed:', error);
    }
    
    try {
      // Test JWT validate function
      const { data, error } = await supabase.functions.invoke('jwt-validate', {
        body: { test: true }
      });
      
      if (error) {
        results.jwtValidate.error = error.message;
        debugLogger.warn('JWT Validate function not available:', error);
      } else {
        results.jwtValidate.available = true;
        debugLogger.info('JWT Validate function available');
      }
    } catch (error) {
      results.jwtValidate.error = error.message;
      debugLogger.error('JWT Validate function test failed:', error);
    }
    
    return results;
  },
  
  // Test database access
  testDatabaseAccess: async () => {
    debugLogger.info('Testing database access...');
    
    const results = {
      userProfiles: { accessible: false, error: null },
      polls: { accessible: false, error: null },
      articles: { accessible: false, error: null }
    };
    
    try {
      // Test user_profiles table access
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        results.userProfiles.error = error.message;
        debugLogger.warn('user_profiles table not accessible:', error);
      } else {
        results.userProfiles.accessible = true;
        debugLogger.info('user_profiles table accessible');
      }
    } catch (error) {
      results.userProfiles.error = error.message;
      debugLogger.error('user_profiles table test failed:', error);
    }
    
    try {
      // Test polls table access
      const { data, error } = await supabase
        .from('polls')
        .select('id')
        .limit(1);
      
      if (error) {
        results.polls.error = error.message;
        debugLogger.warn('polls table not accessible:', error);
      } else {
        results.polls.accessible = true;
        debugLogger.info('polls table accessible');
      }
    } catch (error) {
      results.polls.error = error.message;
      debugLogger.error('polls table test failed:', error);
    }
    
    try {
      // Test articles table access
      const { data, error } = await supabase
        .from('articles')
        .select('id')
        .limit(1);
      
      if (error) {
        results.articles.error = error.message;
        debugLogger.warn('articles table not accessible:', error);
      } else {
        results.articles.accessible = true;
        debugLogger.info('articles table accessible');
      }
    } catch (error) {
      results.articles.error = error.message;
      debugLogger.error('articles table test failed:', error);
    }
    
    return results;
  },
  
  // Run complete authentication diagnostics
  runFullDiagnostics: async () => {
    debugLogger.info('Running full authentication diagnostics...');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: authDiagnostics.checkEnvironment(),
      connection: await authDiagnostics.testConnection(),
      edgeFunctions: await authDiagnostics.testEdgeFunctions(),
      database: await authDiagnostics.testDatabaseAccess()
    };
    
    // Generate summary
    const issues = [];
    if (!diagnostics.environment.passed) {
      issues.push(...diagnostics.environment.issues);
    }
    if (!diagnostics.connection.success) {
      issues.push('Supabase connection failed');
    }
    if (!diagnostics.edgeFunctions.jwtExchange.available) {
      issues.push('JWT Exchange function unavailable');
    }
    if (!diagnostics.edgeFunctions.jwtValidate.available) {
      issues.push('JWT Validate function unavailable');
    }
    if (!diagnostics.database.userProfiles.accessible) {
      issues.push('User profiles table inaccessible');
    }
    
    diagnostics.summary = {
      totalIssues: issues.length,
      issues,
      status: issues.length === 0 ? 'healthy' : 'issues_detected'
    };
    
    debugLogger.info('Diagnostics complete:', diagnostics.summary);
    
    return diagnostics;
  }
};

// Authentication flow debugger
export const authFlowDebugger = {
  // Debug sign in process
  debugSignIn: async (email, password) => {
    debugLogger.info('Debugging sign in process...', { email });
    
    const steps = [];
    
    try {
      // Step 1: Attempt Supabase authentication
      steps.push({ step: 'supabase_auth', status: 'starting' });
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        steps[steps.length - 1].status = 'failed';
        steps[steps.length - 1].error = authError.message;
        debugLogger.error('Supabase authentication failed:', authError);
        return { success: false, steps, error: authError.message };
      }
      
      steps[steps.length - 1].status = 'success';
      steps[steps.length - 1].data = { userId: authData.user?.id };
      debugLogger.info('Supabase authentication successful');
      
      // Step 2: Fetch user profile
      steps.push({ step: 'user_profile', status: 'starting' });
      const profileResult = await authService.getUserProfile(authData.user.id);
      
      if (!profileResult.success) {
        steps[steps.length - 1].status = 'failed';
        steps[steps.length - 1].error = profileResult.error;
        debugLogger.error('User profile fetch failed:', profileResult.error);
      } else {
        steps[steps.length - 1].status = 'success';
        steps[steps.length - 1].data = { tier: profileResult.data?.tier };
        debugLogger.info('User profile fetched successfully');
      }
      
      // Step 3: JWT token exchange
      steps.push({ step: 'jwt_exchange', status: 'starting' });
      const jwtResult = await authService.exchangeForJWT();
      
      if (!jwtResult.success) {
        steps[steps.length - 1].status = 'failed';
        steps[steps.length - 1].error = jwtResult.error;
        debugLogger.error('JWT exchange failed:', jwtResult.error);
      } else {
        steps[steps.length - 1].status = 'success';
        steps[steps.length - 1].data = { tokenType: jwtResult.data?.token_type };
        debugLogger.info('JWT exchange successful');
      }
      
      return { success: true, steps };
      
    } catch (error) {
      debugLogger.error('Sign in debug exception:', error);
      return { success: false, steps, error: error.message };
    }
  },
  
  // Debug JWT token exchange
  debugJWTExchange: async () => {
    debugLogger.info('Debugging JWT token exchange...');
    
    try {
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        debugLogger.error('No active session for JWT exchange');
        return { 
          success: false, 
          error: 'No active session found',
          step: 'session_check'
        };
      }
      
      debugLogger.info('Session found, attempting JWT exchange');
      
      // Test JWT exchange
      const { data, error } = await supabase.functions.invoke('jwt-exchange', {
        body: {
          current_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          custom_claims: { test: true },
          exchange_type: 'custom_jwt'
        }
      });
      
      if (error) {
        debugLogger.error('JWT exchange failed:', error);
        return { 
          success: false, 
          error: error.message,
          step: 'jwt_exchange'
        };
      }
      
      debugLogger.info('JWT exchange successful:', data);
      return { success: true, data };
      
    } catch (error) {
      debugLogger.error('JWT exchange debug exception:', error);
      return { 
        success: false, 
        error: error.message,
        step: 'exception'
      };
    }
  }
};

// Export debug configuration for external modification
export { DEBUG_CONFIG };

export default {
  debugLogger,
  authDiagnostics,
  authFlowDebugger,
  DEBUG_CONFIG
};