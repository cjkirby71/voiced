// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../utils/authService";

const AuthContext = createContext();

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