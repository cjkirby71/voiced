// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window?.localStorage,
    storageKey: 'voiced-auth-token',
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'voiced-civic-platform'
    }
  }
});

// Auth helper functions
export const authHelpers = {
  // Get current session
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user metadata
  updateUser: async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // JWT Token Exchange - Exchange auth token for custom JWT
  exchangeJWTToken: async (customClaims = {}) => {
    try {
      // Get current session first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        return { 
          data: null, 
          error: { message: 'No active session found. Please log in first.' }
        };
      }

      const currentToken = sessionData.session.access_token;
      const refreshToken = sessionData.session.refresh_token;
      
      // Extract user info from current session
      const user = sessionData.session.user;
      
      // Create enhanced JWT payload with custom claims
      const enhancedPayload = {
        // Standard JWT claims
        sub: user.id,
        email: user.email,
        email_verified: user.email_confirmed_at !== null,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
        
        // Custom claims for the Voiced platform
        app_metadata: user.app_metadata || {},
        user_metadata: user.user_metadata || {},
        
        // Platform-specific claims
        platform: 'voiced-civic',
        role: user.role || 'authenticated',
        
        // Merge any additional custom claims
        ...customClaims
      };

      // Call the edge function to exchange tokens
      const { data: exchangeData, error: exchangeError } = await supabase.functions.invoke('jwt-exchange', {
        body: {
          current_token: currentToken,
          refresh_token: refreshToken,
          custom_claims: enhancedPayload,
          exchange_type: 'custom_jwt'
        }
      });

      if (exchangeError) {
        return { data: null, error: exchangeError };
      }

      // Return the new JWT token with enhanced claims
      return {
        data: {
          jwt_token: exchangeData.jwt_token,
          expires_at: exchangeData.expires_at,
          token_type: 'custom_jwt',
          user_id: user.id,
          custom_claims: enhancedPayload
        },
        error: null
      };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'JWT token exchange failed. Please try again.' }
      };
    }
  },

  // Refresh JWT Token - Get a fresh JWT with updated claims
  refreshJWTToken: async (customClaims = {}) => {
    try {
      // First refresh the Supabase session
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData?.session) {
        return {
          data: null,
          error: { message: 'Failed to refresh session. Please log in again.' }
        };
      }

      // Now exchange the refreshed token for a custom JWT
      return await authHelpers.exchangeJWTToken(customClaims);
    } catch (error) {
      return {
        data: null,
        error: { message: 'JWT token refresh failed. Please try again.' }
      };
    }
  },

  // Validate JWT Token - Verify token validity and decode claims
  validateJWTToken: async (jwtToken) => {
    try {
      const { data, error } = await supabase.functions.invoke('jwt-validate', {
        body: {
          jwt_token: jwtToken,
          validation_type: 'custom_jwt'
        }
      });

      if (error) {
        return { data: null, error };
      }

      return {
        data: {
          valid: data.valid,
          claims: data.claims,
          expires_at: data.expires_at,
          user_id: data.claims?.sub
        },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: { message: 'JWT token validation failed.' }
      };
    }
  }
};

// Database helper functions
export const dbHelpers = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user subscription
  getUserSubscription: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get polls based on user tier
  getAccessiblePolls: async (userTier = 'free') => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .or(userTier === 'national' ? 'requires_tier.eq.free,requires_tier.eq.national' : 'requires_tier.eq.free')
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get articles based on user tier
  getAccessibleArticles: async (userTier = 'free') => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .or(userTier === 'national' ? 'requires_tier.eq.free,requires_tier.eq.national' : 'requires_tier.eq.free')
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export default supabase;