// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../utils/authService";

const AuthContext = createContext();

// AuthCallback component to handle authentication redirects
export function AuthCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting callback processing');
        console.log('AuthCallback: Current URL:', window.location.href);
        console.log('AuthCallback: Search params:', location.search);
        
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');

        console.log('AuthCallback: Extracted params:', {
          hasCode: !!code,
          hasError: !!error,
          errorCode,
          errorDescription
        });

        // Handle error cases first
        if (error) {
          let userMessage = 'Authentication failed. Please try again.';
          
          if (errorCode === 'otp_expired' || error === 'access_denied') {
            userMessage = 'Your verification link has expired. Please sign up again to receive a new link.';
          } else if (errorDescription) {
            userMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '));
          }
          
          console.log('AuthCallback: Error detected:', { error, errorCode, errorDescription, userMessage });
          
          if (isMounted) {
            setError(userMessage);
            setStatus('error');
          }
          return;
        }

        // Handle successful code exchange
        if (code) {
          console.log('AuthCallback: Authorization code found, starting exchange process');
          console.log('AuthCallback: Code (first 10 chars):', code.substring(0, 10));
          
          const result = await authService.exchangeCodeForSession(code);
          
          console.log('AuthCallback: Code exchange result:', {
            success: result?.success,
            hasData: !!result?.data,
            error: result?.error
          });
          
          if (result?.success && isMounted) {
            console.log('AuthCallback: Code exchange successful, setting success status');
            setStatus('success');
            
            // Redirect to home dashboard after successful authentication
            setTimeout(() => {
              if (isMounted) {
                console.log('AuthCallback: Redirecting to home dashboard');
                navigate('/home-dashboard', { replace: true });
              }
            }, 2000);
          } else if (isMounted) {
            console.log('AuthCallback: Code exchange failed:', result?.error);
            
            // Handle specific error types
            let errorMessage = result?.error || 'Failed to process authentication. Please try again.';
            
            // Check for specific Supabase errors
            if (result?.error?.includes('expired') || result?.error?.includes('otp_expired')) {
              errorMessage = 'Your verification link has expired. Please request a new one.';
            } else if (result?.error?.includes('invalid') || result?.error?.includes('code')) {
              errorMessage = 'Invalid verification link. Please try signing up again.';
            }
            
            setError(errorMessage);
            setStatus('error');
          }
        } else {
          // No code or error found - redirect to login
          if (isMounted) {
            console.log('AuthCallback: No authorization code found, redirecting to login');
            navigate('/login-screen', { replace: true });
          }
        }
      } catch (error) {
        console.log('AuthCallback: Processing error:', error);
        if (isMounted) {
          setError('Something went wrong processing your authentication. Please try again.');
          setStatus('error');
        }
      }
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate]);

  const handleRetry = () => {
    console.log('AuthCallback: User clicked retry, redirecting to registration');
    navigate('/registration-screen', { replace: true });
  };

  const handleLoginRedirect = () => {
    console.log('AuthCallback: User clicked login, redirecting to login');
    navigate('/login-screen', { replace: true });
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Processing Authentication</h2>
          <p className="text-text-secondary">Please wait while we verify your account...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Authentication Successful!</h2>
          <p className="text-text-secondary mb-4">Redirecting you to your dashboard...</p>
          <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Authentication Failed</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Try Sign Up Again
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setAuthError(null);
        console.log('AuthProvider: Initializing authentication state');

        const sessionResult = await authService.getSession();
        console.log('AuthProvider: Session result:', {
          success: sessionResult?.success,
          hasSession: !!sessionResult?.data?.session,
          hasUser: !!sessionResult?.data?.session?.user
        });

        if (
          sessionResult?.success &&
          sessionResult?.data?.session?.user &&
          isMounted
        ) {
          const authUser = sessionResult.data.session.user;
          setUser(authUser);
          console.log('AuthProvider: User set from session:', authUser.id);

          // Fetch user profile
          console.log('AuthProvider: Fetching user profile');
          const profileResult = await authService.getUserProfile(authUser.id);

          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
            console.log('AuthProvider: User profile loaded:', {
              email: profileResult.data?.email,
              tier: profileResult.data?.tier
            });
            
            // Exchange for JWT token with profile data
            console.log('AuthProvider: Exchanging for JWT token');
            const jwtResult = await authService.exchangeForJWT();
            if (jwtResult?.success && isMounted) {
              setJwtToken(jwtResult.data);
              console.log('AuthProvider: JWT token set successfully');
            } else {
              console.log('AuthProvider: JWT exchange failed:', jwtResult?.error);
            }
          } else if (isMounted) {
            console.log('AuthProvider: Failed to load user profile:', profileResult?.error);
            setAuthError(profileResult?.error || "Failed to load user profile");
          }
        } else {
          console.log('AuthProvider: No valid session found');
        }
      } catch (error) {
        if (isMounted) {
          console.log('AuthProvider: Auth initialization error:', error);
          setAuthError("Failed to initialize authentication");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('AuthProvider: Authentication initialization complete');
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('AuthProvider: Auth state changed:', { event, hasSession: !!session });
      setAuthError(null);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        console.log('AuthProvider: User signed in:', session.user.id);

        // Fetch user profile for signed in user
        authService.getUserProfile(session.user.id).then((profileResult) => {
          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
            console.log('AuthProvider: Profile loaded after sign in');
            
            // Exchange for JWT token
            authService.exchangeForJWT().then((jwtResult) => {
              if (jwtResult?.success && isMounted) {
                setJwtToken(jwtResult.data);
                console.log('AuthProvider: JWT token obtained after sign in');
              }
            });
          } else if (isMounted) {
            console.log('AuthProvider: Profile load failed after sign in:', profileResult?.error);
            setAuthError(profileResult?.error || "Failed to load user profile");
          }
        });
      } else if (event === "SIGNED_OUT") {
        console.log('AuthProvider: User signed out, clearing state');
        setUser(null);
        setUserProfile(null);
        setJwtToken(null);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
        console.log('AuthProvider: Token refreshed for user:', session.user.id);
        
        // Refresh JWT token when Supabase token refreshes
        authService.refreshJWT().then((jwtResult) => {
          if (jwtResult?.success && isMounted) {
            setJwtToken(jwtResult.data);
            console.log('AuthProvider: JWT token refreshed');
          }
        });
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      console.log('AuthProvider: Starting sign in for:', email);
      const result = await authService.signIn(email, password);

      if (!result?.success) {
        console.log('AuthProvider: Sign in failed:', result?.error);
        setAuthError(result?.error || "Login failed");
        return { success: false, error: result?.error };
      }

      console.log('AuthProvider: Sign in successful');
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during login. Please try again.";
      console.log('AuthProvider: Sign in exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError(null);
      console.log('AuthProvider: Starting sign up for:', email);
      const result = await authService.signUp(email, password, userData);

      if (!result?.success) {
        console.log('AuthProvider: Sign up failed:', result?.error);
        setAuthError(result?.error || "Signup failed");
        return { success: false, error: result?.error };
      }

      console.log('AuthProvider: Sign up successful');
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during signup. Please try again.";
      console.log('AuthProvider: Sign up exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setAuthError(null);
      console.log('AuthProvider: Starting sign out');
      const result = await authService.signOut();

      if (!result?.success) {
        console.log('AuthProvider: Sign out failed:', result?.error);
        setAuthError(result?.error || "Logout failed");
        return { success: false, error: result?.error };
      }

      console.log('AuthProvider: Sign out successful');
      return { success: true };
    } catch (error) {
      const errorMsg = "Something went wrong during logout. Please try again.";
      console.log('AuthProvider: Sign out exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setAuthError(null);

      if (!user?.id) {
        const errorMsg = "User not authenticated";
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('AuthProvider: Updating profile for user:', user.id);
      const result = await authService.updateUserProfile(user.id, updates);

      if (!result?.success) {
        console.log('AuthProvider: Profile update failed:', result?.error);
        setAuthError(result?.error || "Profile update failed");
        return { success: false, error: result?.error };
      }

      setUserProfile(result.data);
      console.log('AuthProvider: Profile updated successfully');
      
      // JWT is automatically refreshed in the service
      const updatedJWT = authService.getCurrentJWT();
      if (updatedJWT) {
        setJwtToken(updatedJWT);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong updating profile. Please try again.";
      console.log('AuthProvider: Profile update exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      console.log('AuthProvider: Resetting password for:', email);
      const result = await authService.resetPassword(email);

      if (!result?.success) {
        console.log('AuthProvider: Password reset failed:', result?.error);
        setAuthError(result?.error || "Password reset failed");
        return { success: false, error: result?.error };
      }

      console.log('AuthProvider: Password reset successful');
      return { success: true };
    } catch (error) {
      const errorMsg = "Something went wrong sending reset email. Please try again.";
      console.log('AuthProvider: Password reset exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Exchange for JWT token function
  const exchangeJWT = async (customClaims = {}) => {
    try {
      setAuthError(null);
      console.log('AuthProvider: Exchanging for JWT token');
      const result = await authService.exchangeForJWT(customClaims);

      if (!result?.success) {
        console.log('AuthProvider: JWT exchange failed:', result?.error);
        setAuthError(result?.error || "JWT exchange failed");
        return { success: false, error: result?.error };
      }

      setJwtToken(result.data);
      console.log('AuthProvider: JWT exchange successful');
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong exchanging JWT token. Please try again.";
      console.log('AuthProvider: JWT exchange exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Refresh JWT token function
  const refreshJWT = async (customClaims = {}) => {
    try {
      setAuthError(null);
      const result = await authService.refreshJWT(customClaims);

      if (!result?.success) {
        setAuthError(result?.error || "JWT refresh failed");
        return { success: false, error: result?.error };
      }

      setJwtToken(result.data);
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong refreshing JWT token. Please try again.";
      setAuthError(errorMsg);
      console.log("AuthProvider: JWT refresh exception:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Validate JWT token function
  const validateJWT = async (token) => {
    try {
      setAuthError(null);
      const result = await authService.validateJWT(token || jwtToken?.jwt_token);

      if (!result?.success) {
        setAuthError(result?.error || "JWT validation failed");
        return { success: false, error: result?.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong validating JWT token. Please try again.";
      setAuthError(errorMsg);
      console.log("AuthProvider: JWT validation exception:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Handle authorization code callback
  const handleAuthCallback = async (code) => {
    try {
      setAuthError(null);
      console.log('AuthProvider: Handling auth callback with code');
      const result = await authService.exchangeCodeForSession(code);

      if (!result?.success) {
        console.log('AuthProvider: Auth callback failed:', result?.error);
        setAuthError(result?.error || "Authentication callback failed");
        return { success: false, error: result?.error };
      }

      console.log('AuthProvider: Auth callback successful');
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong processing authentication callback.";
      console.log('AuthProvider: Auth callback exception:', error);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    userProfile,
    jwtToken,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    exchangeJWT,
    refreshJWT,
    validateJWT,
    handleAuthCallback,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;