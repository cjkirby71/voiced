// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { debugLogger } from './debugUtils';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Enhanced authentication helpers
export const authHelpers = {
  // Sign up with email/password
  async signUp(email, password, metadata = {}) {
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
    } else {
      debugLogger.info('SignUp successful', { userId: data?.user?.id, needsConfirmation: !data?.session });
    }
    
    return { data, error };
  },

  // Sign in with email/password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    debugLogger.info('SignIn attempt', { email });
    
    if (error) {
      debugLogger.error('SignIn failed', error);
    } else {
      debugLogger.info('SignIn successful', { userId: data?.user?.id });
    }
    
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      debugLogger.error('SignOut failed', error);
    } else {
      debugLogger.info('SignOut successful');
    }
    
    return { error };
  },

  // Get current session
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      debugLogger.error('GetSession failed', error);
    }
    
    return { data, error };
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

  // Refresh JWT token using edge function
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
        return { data: null, error };
      }

      debugLogger.info('JWT refresh successful');
      return { data, error: null };
    } catch (error) {
      debugLogger.error('JWT refresh exception', error);
      return { data: null, error };
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