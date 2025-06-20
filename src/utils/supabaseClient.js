// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { debugLogger } from './debugUtils';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with enhanced error handling
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Enhanced error handling for refresh token issues
    onRefreshTokenError: (error) => {
      debugLogger.error('Refresh token error detected:', error);
      
      // Clear auth storage on refresh token errors
      try {
        localStorage.removeItem(`sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`);
        sessionStorage.clear();
      } catch (storageError) {
        debugLogger.error('Error clearing storage after refresh token error:', storageError);
      }
    }
  }
});

// Enhanced authentication helpers
export const authHelpers = {
  // Sign up with email/password
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      debugLogger.info('SignUp attempt', { email, hasMetadata: !!Object.keys(metadata).length });
      
      if (error) {
        debugLogger.error('SignUp failed', error);
        
        // Handle refresh token errors during signup
        if (error.message?.toLowerCase()?.includes('refresh token')) {
          debugLogger.warn('Refresh token error during signup, clearing auth state');
          await supabase.auth.signOut({ scope: 'local' });
        }
      } else {
        debugLogger.info('SignUp successful', { userId: data?.user?.id, needsConfirmation: !data?.session });
      }
      
      return { data, error };
    } catch (exception) {
      debugLogger.error('SignUp exception:', exception);
      return { data: null, error: exception };
    }
  },

  // Sign in with email/password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      debugLogger.info('SignIn attempt', { email });
      
      if (error) {
        debugLogger.error('SignIn failed', error);
        
        // Handle refresh token errors during signin
        if (error.message?.toLowerCase()?.includes('refresh token')) {
          debugLogger.warn('Refresh token error during signin, clearing auth state');
          await supabase.auth.signOut({ scope: 'local' });
        }
      } else {
        debugLogger.info('SignIn successful', { userId: data?.user?.id });
      }
      
      return { data, error };
    } catch (exception) {
      debugLogger.error('SignIn exception:', exception);
      return { data: null, error: exception };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        debugLogger.error('SignOut failed', error);
      } else {
        debugLogger.info('SignOut successful');
      }
      
      return { error };
    } catch (exception) {
      debugLogger.error('SignOut exception:', exception);
      return { error: exception };
    }
  },

  // Get current session with refresh token error handling
  async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        debugLogger.error('GetSession failed', error);
        
        // Handle refresh token errors
        if (error.message?.toLowerCase()?.includes('refresh token')) {
          debugLogger.warn('Refresh token error during getSession, clearing auth state');
          await supabase.auth.signOut({ scope: 'local' });
          return { data: { session: null, user: null }, error };
        }
      }
      
      return { data, error };
    } catch (exception) {
      debugLogger.error('GetSession exception:', exception);
      return { data: { session: null, user: null }, error: exception };
    }
  },

  // Reset password
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`
    });
    
    debugLogger.info('Password reset attempt', { email });
    
    if (error) {
      debugLogger.error('Password reset failed', error);
    } else {
      debugLogger.info('Password reset email sent');
    }
    
    return { data, error };
  },

  // Update password
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      debugLogger.error('Password update failed', error);
    } else {
      debugLogger.info('Password updated successfully');
    }
    
    return { data, error };
  },

  // Exchange for JWT token using edge function
  async exchangeJWTToken(customClaims = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('jwt-exchange', {
        body: {
          custom_claims: customClaims,
          exchange_type: 'session'
        }
      });

      if (error) {
        debugLogger.error('JWT exchange failed', error);
        return { data: null, error };
      }

      debugLogger.info('JWT exchange successful');
      return { data, error: null };
    } catch (error) {
      debugLogger.error('JWT exchange exception', error);
      return { data: null, error };
    }
  },

  // Refresh JWT token using edge function with enhanced error handling
  async refreshJWTToken(customClaims = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('jwt-exchange', {
        body: {
          custom_claims: customClaims,
          exchange_type: 'refresh'
        }
      });

      if (error) {
        debugLogger.error('JWT refresh failed', error);
        
        // Handle refresh token errors specifically
        if (error.message?.toLowerCase()?.includes('refresh token')) {
          debugLogger.warn('Refresh token error during JWT refresh, clearing auth state');
          await supabase.auth.signOut({ scope: 'local' });
        }
        
        return { data: null, error };
      }

      debugLogger.info('JWT refresh successful');
      return { data, error: null };
    } catch (exception) {
      debugLogger.error('JWT refresh exception', exception);
      
      // Handle refresh token errors in exceptions
      if (exception.message?.toLowerCase()?.includes('refresh token')) {
        debugLogger.warn('Refresh token error exception during JWT refresh, clearing auth state');
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      return { data: null, error: exception };
    }
  },

  // Validate JWT token using edge function
  async validateJWTToken(jwtToken) {
    try {
      const { data, error } = await supabase.functions.invoke('jwt-validate', {
        body: {
          jwt_token: jwtToken
        }
      });

      if (error) {
        debugLogger.error('JWT validation failed', error);
        return { data: null, error };
      }

      debugLogger.info('JWT validation successful', { valid: data?.valid });
      return { data, error: null };
    } catch (error) {
      debugLogger.error('JWT validation exception', error);
      return { data: null, error };
    }
  }
};

// Database helpers
export const dbHelpers = {
  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      debugLogger.error('Get user profile failed', error);
    }
    
    return { data, error };
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      debugLogger.error('Update user profile failed', error);
    } else {
      debugLogger.info('User profile updated', { userId, updates });
    }
    
    return { data, error };
  },

  // Get user subscription
  async getUserSubscription(userId) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    return { data, error };
  },

  // Get polls based on user tier
  async getAccessiblePolls(userTier = 'free') {
    let query = supabase
      .from('polls')
      .select('*')
      .eq('is_active', true);
    
    if (userTier === 'free') {
      query = query.eq('tier_required', 'free');
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get articles based on user tier
  async getAccessibleArticles(userTier = 'free') {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true);
    
    if (userTier === 'free') {
      query = query.eq('tier_required', 'free');
    }
    
    const { data, error } = await query.order('published_at', { ascending: false });
    
    return { data, error };
  }
};

export default supabase;