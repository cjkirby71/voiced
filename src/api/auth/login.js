// src/api/auth/login.js
import authService from '../../utils/authService';

/**
 * API endpoint handler for user login
 * This simulates an API endpoint structure while using Supabase client-side auth
 */
export async function loginHandler(credentials) {
  try {
    const { email, password } = credentials;

    // Validate required fields
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
        status: 400
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
        status: 400
      };
    }

    // Authenticate user through Supabase
    const result = await authService.signIn(email, password);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        status: 401
      };
    }

    // Get user profile data
    let userProfile = null;
    if (result.data?.user?.id) {
      const profileResult = await authService.getUserProfile(result.data.user.id);
      if (profileResult.success) {
        userProfile = profileResult.data;
      }
    }

    // Return success response with user data and JWT token
    return {
      success: true,
      data: {
        user: result.data.user,
        userProfile,
        token: result.data.session?.access_token,
        refreshToken: result.data.session?.refresh_token,
        expiresAt: result.data.session?.expires_at
      },
      status: 200
    };

  } catch (error) {
    console.log('Login API error:', error);
    return {
      success: false,
      error: 'Internal server error during login',
      status: 500
    };
  }
}

/**
 * Client-side login function that simulates API call
 */
export async function login(credentials) {
  try {
    // In a real API, this would be a fetch call to /api/auth/login
    // For now, we directly call the handler to simulate the API behavior
    const response = await loginHandler(credentials);
    
    if (!response.success) {
      throw new Error(response.error);
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
}

/**
 * Get JWT token from current session
 */
export async function getAuthToken() {
  try {
    const sessionResult = await authService.getSession();
    
    if (sessionResult.success && sessionResult.data?.session) {
      return {
        success: true,
        token: sessionResult.data.session.access_token,
        expiresAt: sessionResult.data.session.expires_at
      };
    }

    return {
      success: false,
      error: 'No active session found'
    };
  } catch (error) {
    console.log('Get auth token error:', error);
    return {
      success: false,
      error: 'Failed to get authentication token'
    };
  }
}

export default { loginHandler, login, getAuthToken };