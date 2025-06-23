// src/utils/authService.js
import supabase from './supabaseClient';
import { authHelpers, dbHelpers } from './supabaseClient';
import errorRecoveryManager, { withErrorRecovery } from './errorRecovery';
import { debugLogger } from './debugUtils';

// Enhanced authentication service with Supabase integration
class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentProfile = null;
    this.currentJWT = null;
    this.isDebugging = import.meta.env.DEV || localStorage.getItem('auth_debug') === 'true';
  }

  // Enable/disable debug mode
  setDebugMode(enabled) {
    this.isDebugging = enabled;
    if (enabled) {
      localStorage.setItem('auth_debug', 'true');
    } else {
      localStorage.removeItem('auth_debug');
    }
    debugLogger.info(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Enhanced logging wrapper
  log(level, message, data = null) {
    if (this.isDebugging) {
      debugLogger[level](message, data);
    }
  }

  // Sign up new user with enhanced error handling
  async signUp(email, password, userData = {}) {
    return withErrorRecovery(async () => {
      this.log('info', 'Starting user registration', { email, userData: { ...userData, password: '[REDACTED]' } });
      
      try {
        const { data, error } = await authHelpers.signUp(email, password, {
          full_name: userData.fullName || '',
          tier: userData.tier || 'free',
          zip_code: userData.zipCode || '',
          phone_number: userData.phoneNumber || '',
          sms_notifications: userData.smsNotifications || false,
          email_notifications: userData.emailNotifications !== false
        });

        if (error) {
          this.log('error', 'Supabase signup failed', error);
          return { success: false, error: error.message };
        }

        this.log('info', 'Supabase signup successful', { userId: data.user?.id, needsConfirmation: !data.session });

        // Check if user needs email confirmation
        if (data?.user && !data?.session) {
          this.log('info', 'User needs email confirmation');
          return {
            success: true,
            data: data.user,
            message: 'Please check your email to confirm your account.'
          };
        }

        // If signup successful and session exists, exchange for JWT
        if (data?.session) {
          this.currentUser = data.user;
          this.log('info', 'Session created, attempting JWT exchange');
          const jwtResult = await this.exchangeForJWT();
          if (jwtResult?.success) {
            this.currentJWT = jwtResult.data;
            this.log('info', 'JWT exchange successful during signup');
          } else {
            this.log('warn', 'JWT exchange failed during signup', jwtResult?.error);
          }
        }

        return { success: true, data: data.user };
      } catch (error) {
        this.log('error', 'SignUp service exception', error);
        return { success: false, error: 'Failed to create account. Please try again.' };
      }
    }, { operation: 'signUp', email })();
  }

  // Enhanced sign in with detailed logging
  async signIn(email, password) {
    return withErrorRecovery(async () => {
      this.log('info', 'Starting user sign in', { email });
      
      try {
        const { data, error } = await authHelpers.signIn(email, password);

        if (error) {
          this.log('error', 'Supabase signin failed', error);
          return { success: false, error: error.message };
        }

        if (data?.user) {
          this.currentUser = data.user;
          this.log('info', 'Supabase signin successful', { userId: data.user.id });
          
          // Fetch user profile
          this.log('info', 'Fetching user profile');
          const profileResult = await this.getUserProfile(data.user.id);
          
          if (profileResult?.success) {
            this.log('info', 'User profile fetched successfully', { tier: profileResult.data?.tier });
          } else {
            this.log('warn', 'User profile fetch failed', profileResult?.error);
          }
          
          // Exchange Supabase token for enhanced JWT
          this.log('info', 'Attempting JWT token exchange');
          const jwtResult = await this.exchangeForJWT();
          
          if (jwtResult?.success) {
            this.currentJWT = jwtResult.data;
            this.log('info', 'JWT exchange successful', { tokenType: jwtResult.data?.token_type });
          } else {
            this.log('error', 'JWT exchange failed', jwtResult?.error);
            // Continue with signin even if JWT exchange fails
          }
          
          return { success: true, data: data };
        }

        this.log('error', 'No user data returned from signin');
        return { success: false, error: 'Login failed. Please try again.' };
      } catch (error) {
        this.log('error', 'SignIn service exception', error);
        return { success: false, error: 'Login failed. Please try again.' };
      }
    }, { operation: 'signIn', email })();
  }

  // Sign in with magic link
  async signInWithMagicLink(email) {
    return withErrorRecovery(async () => {
      this.log('info', 'Starting magic link sign in', { email });
      
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) {
          this.log('error', 'Magic link sign in failed', error);
          return { success: false, error: error.message };
        }

        this.log('info', 'Magic link sent successfully');
        return { 
          success: true, 
          message: 'Check your email for a magic link to sign in.' 
        };
      } catch (error) {
        this.log('error', 'SignInWithMagicLink service exception', error);
        return { success: false, error: 'Failed to send magic link. Please try again.' };
      }
    }, { operation: 'signInWithMagicLink', email })();
  }

  // Sign out user
  async signOut() {
    try {
      this.log('info', 'Starting user sign out');
      
      const { error } = await authHelpers.signOut();

      if (error) {
        this.log('error', 'Supabase signout failed', error);
        return { success: false, error: error.message };
      }

      this.currentUser = null;
      this.currentProfile = null;
      this.currentJWT = null;
      
      this.log('info', 'User signed out successfully');
      return { success: true };
    } catch (error) {
      this.log('error', 'SignOut service exception', error);
      return { success: false, error: 'Logout failed. Please try again.' };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data, error } = await authHelpers.getCurrentSession();

      if (error) {
        this.log('error', 'Get session failed', error);
        return { success: false, error: error.message };
      }

      this.log('debug', 'Session retrieved', { hasSession: !!data.session });
      return { success: true, data };
    } catch (error) {
      this.log('error', 'GetSession service exception', error);
      return { success: false, error: 'Failed to get session.' };
    }
  }

  // Exchange authorization code for session (for magic link callbacks)
  async exchangeCodeForSession(code) {
    return withErrorRecovery(async () => {
      this.log('info', 'Exchanging authorization code for session', { code: code?.substring(0, 10) + '...' });
      
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          this.log('error', 'Code exchange failed', error);
          return { success: false, error: error.message };
        }

        if (data?.user) {
          this.currentUser = data.user;
          this.log('info', 'Code exchange successful', { userId: data.user.id });
          
          // Fetch user profile
          const profileResult = await this.getUserProfile(data.user.id);
          if (profileResult?.success) {
            this.log('info', 'User profile fetched after code exchange');
          }
          
          // Exchange for JWT token using the edge function
          const jwtResult = await this.exchangeCodeForJWT(code);
          if (jwtResult?.success) {
            this.currentJWT = jwtResult.data;
            this.log('info', 'JWT exchange successful after code exchange');
          } else {
            this.log('warn', 'JWT exchange failed after code exchange', jwtResult?.error);
          }
        }

        return { success: true, data };
      } catch (error) {
        this.log('error', 'ExchangeCodeForSession service exception', error);
        return { success: false, error: 'Failed to exchange authorization code.' };
      }
    }, { operation: 'exchangeCodeForSession', code: code?.substring(0, 10) + '...' })();
  }

  // Exchange authorization code for JWT token (new method)
  async exchangeCodeForJWT(authorizationCode, customClaims = {}) {
    return withErrorRecovery(async () => {
      this.log('info', 'Exchanging authorization code for JWT token');
      
      try {
        const { data, error } = await supabase.functions.invoke('jwt-exchange', {
          body: {
            authorization_code: authorizationCode,
            custom_claims: customClaims,
            exchange_type: 'authorization_code'
          }
        });

        if (error) {
          this.log('error', 'JWT code exchange failed', error);
          return { success: false, error: error.message };
        }

        this.currentJWT = data;
        this.log('info', 'JWT code exchange successful');
        return { success: true, data };
      } catch (error) {
        this.log('error', 'ExchangeCodeForJWT service exception', error);
        return { success: false, error: 'Failed to exchange authorization code for JWT.' };
      }
    }, { operation: 'exchangeCodeForJWT' })();
  }

  // Enhanced JWT exchange with detailed error handling
  async exchangeForJWT(customClaims = {}) {
    return withErrorRecovery(async () => {
      this.log('info', 'Starting JWT token exchange', customClaims);
      
      try {
        // Get user profile to include in custom claims
        let userProfile = null;
        if (this.currentUser?.id) {
          this.log('debug', 'Fetching user profile for JWT claims');
          const profileResult = await this.getUserProfile(this.currentUser.id);
          if (profileResult?.success) {
            userProfile = profileResult.data;
            this.log('debug', 'User profile included in JWT claims', { tier: userProfile?.tier });
          } else {
            this.log('warn', 'Could not fetch user profile for JWT claims', profileResult?.error);
          }
        }

        // Prepare custom claims with user profile data
        const enhancedClaims = {
          tier: userProfile?.tier || 'free',
          zip_code: userProfile?.zip_code,
          phone_number: userProfile?.phone_number,
          sms_notifications: userProfile?.sms_notifications || false,
          email_notifications: userProfile?.email_notifications !== false,
          profile_complete: !!(userProfile?.full_name && userProfile?.email),
          ...customClaims
        };

        this.log('debug', 'Enhanced claims prepared', enhancedClaims);

        const { data, error } = await authHelpers.exchangeJWTToken(enhancedClaims);

        if (error) {
          this.log('error', 'JWT exchange failed', error);
          return { success: false, error: error.message };
        }

        this.currentJWT = data;
        this.log('info', 'JWT exchange successful', { 
          tokenType: data?.token_type,
          expiresAt: data?.expires_at ? new Date(data.expires_at * 1000).toISOString() : 'unknown'
        });
        
        return { success: true, data };
      } catch (error) {
        this.log('error', 'JWT Exchange service exception', error);
        return { success: false, error: 'Failed to exchange JWT token.' };
      }
    }, { operation: 'exchangeJWT', customClaims })();
  }

  // Refresh JWT token with error recovery
  async refreshJWT(customClaims = {}) {
    return withErrorRecovery(async () => {
      this.log('info', 'Starting JWT token refresh', customClaims);
      
      try {
        const { data, error } = await authHelpers.refreshJWTToken(customClaims);

        if (error) {
          this.log('error', 'JWT refresh failed', error);
          return { success: false, error: error.message };
        }

        this.currentJWT = data;
        this.log('info', 'JWT refresh successful');
        return { success: true, data };
      } catch (error) {
        this.log('error', 'JWT Refresh service exception', error);
        return { success: false, error: 'Failed to refresh JWT token.' };
      }
    }, { operation: 'refreshJWT', customClaims })();
  }

  // Validate JWT token
  async validateJWT(jwtToken) {
    try {
      const tokenToValidate = jwtToken || this.currentJWT?.jwt_token;
      this.log('info', 'Starting JWT token validation', { hasToken: !!tokenToValidate });
      
      if (!tokenToValidate) {
        this.log('warn', 'No JWT token provided for validation');
        return { success: false, error: 'No JWT token provided' };
      }
      
      const { data, error } = await authHelpers.validateJWTToken(tokenToValidate);

      if (error) {
        this.log('error', 'JWT validation failed', error);
        return { success: false, error: error.message };
      }

      this.log('info', 'JWT validation successful', { valid: data?.valid });
      return { success: true, data };
    } catch (error) {
      this.log('error', 'JWT Validation service exception', error);
      return { success: false, error: 'Failed to validate JWT token.' };
    }
  }

  // Get current JWT token
  getCurrentJWT() {
    return this.currentJWT;
  }

  // Get user profile with error handling
  async getUserProfile(userId) {
    try {
      this.log('debug', 'Fetching user profile', { userId });
      
      const { data, error } = await dbHelpers.getUserProfile(userId);

      if (error) {
        this.log('error', 'Get user profile failed', error);
        return { success: false, error: error.message };
      }

      this.currentProfile = data;
      this.log('debug', 'User profile fetched successfully', { tier: data?.tier });
      return { success: true, data };
    } catch (error) {
      this.log('error', 'GetUserProfile service exception', error);
      return { success: false, error: 'Failed to load user profile.' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      this.log('info', 'Updating user profile', { userId, updates });
      
      const { data, error } = await dbHelpers.updateUserProfile(userId, updates);

      if (error) {
        this.log('error', 'Update user profile failed', error);
        return { success: false, error: error.message };
      }

      this.currentProfile = data;
      this.log('info', 'User profile updated successfully');
      
      // Refresh JWT with updated profile data
      const jwtRefreshResult = await this.refreshJWT();
      if (!jwtRefreshResult.success) {
        this.log('warn', 'JWT refresh failed after profile update', jwtRefreshResult.error);
      }
      
      return { success: true, data };
    } catch (error) {
      this.log('error', 'UpdateUserProfile service exception', error);
      return { success: false, error: 'Failed to update profile.' };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      this.log('info', 'Initiating password reset', { email });
      
      const { data, error } = await authHelpers.resetPassword(email);

      if (error) {
        this.log('error', 'Password reset failed', error);
        return { success: false, error: error.message };
      }

      this.log('info', 'Password reset email sent successfully');
      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      };
    } catch (error) {
      this.log('error', 'ResetPassword service exception', error);
      return { success: false, error: 'Failed to send reset email.' };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      this.log('info', 'Updating user password');
      
      const { data, error } = await authHelpers.updatePassword(newPassword);

      if (error) {
        this.log('error', 'Password update failed', error);
        return { success: false, error: error.message };
      }

      this.log('info', 'Password updated successfully');
      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      this.log('error', 'UpdatePassword service exception', error);
      return { success: false, error: 'Failed to update password.' };
    }
  }

  // Get user subscription
  async getUserSubscription(userId) {
    try {
      const { data, error } = await dbHelpers.getUserSubscription(userId);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is ok
        this.log('error', 'Get user subscription failed', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      this.log('error', 'GetUserSubscription service exception', error);
      return { success: false, error: 'Failed to load subscription.' };
    }
  }

  // Get accessible content based on user tier
  async getAccessiblePolls(userTier = 'free') {
    try {
      const { data, error } = await dbHelpers.getAccessiblePolls(userTier);

      if (error) {
        this.log('error', 'Get accessible polls failed', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      this.log('error', 'GetAccessiblePolls service exception', error);
      return { success: false, error: 'Failed to load polls.' };
    }
  }

  // Get accessible articles based on user tier
  async getAccessibleArticles(userTier = 'free') {
    try {
      const { data, error } = await dbHelpers.getAccessibleArticles(userTier);

      if (error) {
        this.log('error', 'Get accessible articles failed', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      this.log('error', 'GetAccessibleArticles service exception', error);
      return { success: false, error: 'Failed to load articles.' };
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    this.log('debug', 'Setting up auth state change listener');
    return supabase.auth.onAuthStateChange((event, session) => {
      this.log('info', 'Auth state changed', { event, hasSession: !!session });
      callback(event, session);
    });
  }

  // Upgrade user tier (for subscription management)
  async upgradeTier(userId, newTier, subscriptionData) {
    try {
      this.log('info', 'Upgrading user tier', { userId, newTier });
      
      // Update user profile tier
      const profileResult = await this.updateUserProfile(userId, { tier: newTier });
      
      if (!profileResult.success) {
        return profileResult;
      }

      // Create subscription record
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          tier: newTier,
          price_paid: subscriptionData.price,
          payment_method: subscriptionData.paymentMethod,
          stripe_subscription_id: subscriptionData.stripeSubscriptionId,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        this.log('error', 'Create subscription record failed', error);
        return { success: false, error: error.message };
      }

      // Refresh JWT with updated tier
      await this.refreshJWT();

      this.log('info', 'Tier upgrade completed successfully');
      return { success: true, data };
    } catch (error) {
      this.log('error', 'UpgradeTier service exception', error);
      return { success: false, error: 'Failed to upgrade tier.' };
    }
  }

  // Check if user has access to tier-based content
  async checkTierAccess(userId, requiredTier) {
    try {
      const profileResult = await this.getUserProfile(userId);
      
      if (!profileResult.success) {
        return { success: false, hasAccess: false };
      }

      const userTier = profileResult.data?.tier || 'free';
      
      // Free tier can access free content
      if (requiredTier === 'free') {
        return { success: true, hasAccess: true };
      }
      
      // National tier can access all content
      if (userTier === 'national') {
        return { success: true, hasAccess: true };
      }

      return { success: true, hasAccess: false };
    } catch (error) {
      this.log('error', 'CheckTierAccess service exception', error);
      return { success: false, hasAccess: false };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;