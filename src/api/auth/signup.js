// src/api/auth/signup.js
import authService from '../../utils/authService';

/**
 * API endpoint handler for user signup
 * This simulates an API endpoint structure while using Supabase client-side auth
 */
export async function signupHandler(userData) {
  try {
    const { email, password, ...additionalData } = userData;

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

    // Validate password strength
    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long',
        status: 400
      };
    }

    // Create user through Supabase auth
    const result = await authService.signUp(email, password, additionalData);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        status: 400
      };
    }

    // Return success response with user data
    return {
      success: true,
      data: {
        user: result.data,
        message: result.message || 'Account created successfully'
      },
      status: 201
    };

  } catch (error) {
    console.log('Signup API error:', error);
    return {
      success: false,
      error: 'Internal server error during signup',
      status: 500
    };
  }
}

/**
 * Client-side signup function that simulates API call
 */
export async function signup(userData) {
  try {
    // In a real API, this would be a fetch call to /api/auth/signup
    // For now, we directly call the handler to simulate the API behavior
    const response = await signupHandler(userData);
    
    if (!response.success) {
      throw new Error(response.error);
    }

    return response;
  } catch (error) {
    throw new Error(error.message || 'Signup failed');
  }
}

export default { signupHandler, signup };