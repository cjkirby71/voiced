// src/utils/authService.js
import { supabase } from './supabaseClient';
import { authHelpers, dbHelpers } from './supabaseClient';

// Enhanced authentication service with Supabase integration
class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentProfile = null;
    this.currentJWT = null;
  }

  // Sign up new user
  async signUp(email, password, userData = {}) {
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
        return { success: false, error: error.message };
      }

      // Check if user needs email confirmation
      if (data?.user && !data?.session) {
        return {
          success: true,
          data: data.user,
          message: 'Please check your email to confirm your account.'
        };
      }

      // If signup successful and session exists, exchange for JWT
      if (data?.session) {
        const jwtResult = await this.exchangeForJWT();
        if (jwtResult?.success) {
          this.currentJWT = jwtResult.data;
        }
      }

      return { success: true, data: data.user };
    } catch (error) {
      console.log('SignUp service error:', error);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await authHelpers.signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        this.currentUser = data.user;
        
        // Exchange Supabase token for enhanced JWT
        const jwtResult = await this.exchangeForJWT();
        if (jwtResult?.success) {
          this.currentJWT = jwtResult.data;
        }
        
        return { success: true, data: data };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.log('SignIn service error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await authHelpers.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      this.currentUser = null;
      this.currentProfile = null;
      this.currentJWT = null;
      return { success: true };
    } catch (error) {
      console.log('SignOut service error:', error);
      return { success: false, error: 'Logout failed. Please try again.' };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data, error } = await authHelpers.getCurrentSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('GetSession service error:', error);
      return { success: false, error: 'Failed to get session.' };
    }
  }

  // Exchange Supabase token for enhanced JWT
  async exchangeForJWT(customClaims = {}) {
    try {
      // Get user profile to include in custom claims
      let userProfile = null;
      if (this.currentUser?.id) {
        const profileResult = await this.getUserProfile(this.currentUser.id);
        if (profileResult?.success) {
          userProfile = profileResult.data;
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

      const { data, error } = await authHelpers.exchangeJWTToken(enhancedClaims);

      if (error) {
        return { success: false, error: error.message };
      }

      this.currentJWT = data;
      return { success: true, data };
    } catch (error) {
      console.log('JWT Exchange service error:', error);
      return { success: false, error: 'Failed to exchange JWT token.' };
    }
  }

  // Refresh JWT token
  async refreshJWT(customClaims = {}) {
    try {
      const { data, error } = await authHelpers.refreshJWTToken(customClaims);

      if (error) {
        return { success: false, error: error.message };
      }

      this.currentJWT = data;
      return { success: true, data };
    } catch (error) {
      console.log('JWT Refresh service error:', error);
      return { success: false, error: 'Failed to refresh JWT token.' };
    }
  }

  // Validate JWT token
  async validateJWT(jwtToken) {
    try {
      const { data, error } = await authHelpers.validateJWTToken(jwtToken);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('JWT Validation service error:', error);
      return { success: false, error: 'Failed to validate JWT token.' };
    }
  }

  // Get current JWT token
  getCurrentJWT() {
    return this.currentJWT;
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await dbHelpers.getUserProfile(userId);

      if (error) {
        return { success: false, error: error.message };
      }

      this.currentProfile = data;
      return { success: true, data };
    } catch (error) {
      console.log('GetUserProfile service error:', error);
      return { success: false, error: 'Failed to load user profile.' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await dbHelpers.updateUserProfile(userId, updates);

      if (error) {
        return { success: false, error: error.message };
      }

      this.currentProfile = data;
      
      // Refresh JWT with updated profile data
      await this.refreshJWT();
      
      return { success: true, data };
    } catch (error) {
      console.log('UpdateUserProfile service error:', error);
      return { success: false, error: 'Failed to update profile.' };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await authHelpers.resetPassword(email);

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      };
    } catch (error) {
      console.log('ResetPassword service error:', error);
      return { success: false, error: 'Failed to send reset email.' };
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await authHelpers.updatePassword(newPassword);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
      console.log('UpdatePassword service error:', error);
      return { success: false, error: 'Failed to update password.' };
    }
  }

  // Get user subscription
  async getUserSubscription(userId) {
    try {
      const { data, error } = await dbHelpers.getUserSubscription(userId);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is ok
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('GetUserSubscription service error:', error);
      return { success: false, error: 'Failed to load subscription.' };
    }
  }

  // Get accessible content based on user tier
  async getAccessiblePolls(userTier = 'free') {
    try {
      const { data, error } = await dbHelpers.getAccessiblePolls(userTier);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('GetAccessiblePolls service error:', error);
      return { success: false, error: 'Failed to load polls.' };
    }
  }

  // Get accessible articles based on user tier
  async getAccessibleArticles(userTier = 'free') {
    try {
      const { data, error } = await dbHelpers.getAccessibleArticles(userTier);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.log('GetAccessibleArticles service error:', error);
      return { success: false, error: 'Failed to load articles.' };
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Upgrade user tier (for subscription management)
  async upgradeTier(userId, newTier, subscriptionData) {
    try {
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
        return { success: false, error: error.message };
      }

      // Refresh JWT with updated tier
      await this.refreshJWT();

      return { success: true, data };
    } catch (error) {
      console.log('UpgradeTier service error:', error);
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
      console.log('CheckTierAccess service error:', error);
      return { success: false, hasAccess: false };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;