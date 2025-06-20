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
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');

        // Handle error cases first
        if (error) {
          let userMessage = 'Authentication failed. Please try again.';
          
          if (errorCode === 'otp_expired' || error === 'access_denied') {
            userMessage = 'Your verification link has expired. Please sign up again to receive a new link.';
          } else if (errorDescription) {
            userMessage = decodeURIComponent(errorDescription.replace(/\+/g, ' '));
          }
          
          console.log('Auth callback error:', { error, errorCode, errorDescription });
          
          if (isMounted) {
            setError(userMessage);
            setStatus('error');
          }
          return;
        }

        // Handle successful code exchange
        if (code) {
          console.log('Processing authorization code...');
          
          const result = await authService.exchangeCodeForSession(code);
          
          if (result?.success && isMounted) {
            console.log('Authorization code exchange successful');
            setStatus('success');
            
            // Redirect to home dashboard after successful authentication
            setTimeout(() => {
              if (isMounted) {
                navigate('/home-dashboard', { replace: true });
              }
            }, 2000);
          } else if (isMounted) {
            console.log('Authorization code exchange failed:', result?.error);
            setError(result?.error || 'Failed to process authentication. Please try again.');
            setStatus('error');
          }
        } else {
          // No code or error found - redirect to login
          if (isMounted) {
            console.log('No authorization code found, redirecting to login');
            navigate('/login-screen', { replace: true });
          }
        }
      } catch (error) {
        console.log('Auth callback processing error:', error);
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
    navigate('/registration-screen', { replace: true });
  };

  const handleLoginRedirect = () => {
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

        const sessionResult = await authService.getSession();

        if (
          sessionResult?.success &&
          sessionResult?.data?.session?.user &&
          isMounted
        ) {
          const authUser = sessionResult.data.session.user;
          setUser(authUser);

          // Fetch user profile
          const profileResult = await authService.getUserProfile(authUser.id);

          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
            
            // Exchange for JWT token with profile data
            const jwtResult = await authService.exchangeForJWT();
            if (jwtResult?.success && isMounted) {
              setJwtToken(jwtResult.data);
            }
          } else if (isMounted) {
            setAuthError(profileResult?.error || "Failed to load user profile");
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthError("Failed to initialize authentication");
          console.log("Auth initialization error:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setAuthError(null);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);

        // Fetch user profile for signed in user
        authService.getUserProfile(session.user.id).then((profileResult) => {
          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
            
            // Exchange for JWT token
            authService.exchangeForJWT().then((jwtResult) => {
              if (jwtResult?.success && isMounted) {
                setJwtToken(jwtResult.data);
              }
            });
          } else if (isMounted) {
            setAuthError(profileResult?.error || "Failed to load user profile");
          }
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
        setJwtToken(null);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
        
        // Refresh JWT token when Supabase token refreshes
        authService.refreshJWT().then((jwtResult) => {
          if (jwtResult?.success && isMounted) {
            setJwtToken(jwtResult.data);
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
      const result = await authService.signIn(email, password);

      if (!result?.success) {
        setAuthError(result?.error || "Login failed");
        return { success: false, error: result?.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during login. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign in error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError(null);
      const result = await authService.signUp(email, password, userData);

      if (!result?.success) {
        setAuthError(result?.error || "Signup failed");
        return { success: false, error: result?.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during signup. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign up error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setAuthError(null);
      const result = await authService.signOut();

      if (!result?.success) {
        setAuthError(result?.error || "Logout failed");
        return { success: false, error: result?.error };
      }

      return { success: true };
    } catch (error) {
      const errorMsg = "Something went wrong during logout. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign out error:", error);
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

      const result = await authService.updateUserProfile(user.id, updates);

      if (!result?.success) {
        setAuthError(result?.error || "Profile update failed");
        return { success: false, error: result?.error };
      }

      setUserProfile(result.data);
      
      // JWT is automatically refreshed in the service
      const updatedJWT = authService.getCurrentJWT();
      if (updatedJWT) {
        setJwtToken(updatedJWT);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg =
        "Something went wrong updating profile. Please try again.";
      setAuthError(errorMsg);
      console.log("Update profile error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      const result = await authService.resetPassword(email);

      if (!result?.success) {
        setAuthError(result?.error || "Password reset failed");
        return { success: false, error: result?.error };
      }

      return { success: true };
    } catch (error) {
      const errorMsg =
        "Something went wrong sending reset email. Please try again.";
      setAuthError(errorMsg);
      console.log("Reset password error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Exchange for JWT token function
  const exchangeJWT = async (customClaims = {}) => {
    try {
      setAuthError(null);
      const result = await authService.exchangeForJWT(customClaims);

      if (!result?.success) {
        setAuthError(result?.error || "JWT exchange failed");
        return { success: false, error: result?.error };
      }

      setJwtToken(result.data);
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong exchanging JWT token. Please try again.";
      setAuthError(errorMsg);
      console.log("JWT exchange error:", error);
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
      console.log("JWT refresh error:", error);
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
      console.log("JWT validation error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Handle authorization code callback
  const handleAuthCallback = async (code) => {
    try {
      setAuthError(null);
      const result = await authService.exchangeCodeForSession(code);

      if (!result?.success) {
        setAuthError(result?.error || "Authentication callback failed");
        return { success: false, error: result?.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong processing authentication callback.";
      setAuthError(errorMsg);
      console.log("Auth callback error:", error);
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