// src/hooks/useAuth.jsx
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


// Custom hook for authentication logic
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    hasPermission,
    isAdmin,
    isModerator
  } = useUser();

  const navigate = useNavigate();

  // Redirect to login if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login-screen');
      return false;
    }
    return true;
  };

  // Redirect to dashboard if already authenticated
  const requireGuest = () => {
    if (isAuthenticated) {
      navigate('/home-dashboard');
      return false;
    }
    return true;
  };

  // Check if user has required role
  const requireRole = (requiredRole) => {
    if (!isAuthenticated) {
      navigate('/login-screen');
      return false;
    }
    
    if (user?.role !== requiredRole && !isAdmin()) {
      navigate('/home-dashboard');
      return false;
    }
    
    return true;
  };

  // Login with redirect
  const loginWithRedirect = async (credentials, redirectTo = '/home-dashboard') => {
    const result = await login(credentials);
    if (result.success) {
      navigate(redirectTo);
    }
    return result;
  };

  // Logout with redirect
  const logoutWithRedirect = (redirectTo = '/login-screen') => {
    logout();
    navigate(redirectTo);
  };

  return {
    // User state
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Auth actions
    login,
    logout,
    loginWithRedirect,
    logoutWithRedirect,
    clearError,
    
    // Permission checks
    hasPermission,
    isAdmin,
    isModerator,
    
    // Route guards
    requireAuth,
    requireGuest,
    requireRole
  };
};

export default useAuth;