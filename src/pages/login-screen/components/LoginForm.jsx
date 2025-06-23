// src/pages/login-screen/components/LoginForm.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const LoginForm = ({ isLoading: externalLoading, onSwitchToMagicLink }) => {
  const { signIn, authError, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const result = await signIn(credentials.email, credentials.password);
      
      if (result.success) {
        // Redirect will be handled by auth state change in parent component
        console.log('Login successful');
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const loadingState = isLoading || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display auth error */}
      {authError && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700 flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} />
            <span>{authError}</span>
          </p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={20} className="text-text-muted" />
          </div>
          <input
            id="email"
            type="email"
            value={credentials.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.email ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
            }`}
            placeholder="Enter your email address"
            disabled={loadingState}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={16} />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={20} className="text-text-muted" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              errors.password ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
            }`}
            placeholder="Enter your password"
            disabled={loadingState}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors duration-200"
            disabled={loadingState}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={16} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loadingState}
        className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 min-h-12"
      >
        {loadingState ? (
          <Icon name="Loader2" size={20} className="animate-spin" />
        ) : (
          <>
            <Icon name="LogIn" size={20} />
            <span>Sign In</span>
          </>
        )}
      </button>

      {/* Magic Link Option */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToMagicLink}
          className="text-sm text-blue-600 hover:text-blue-700 underline transition-colors duration-200 flex items-center justify-center space-x-1"
          disabled={loadingState}
        >
          <Icon name="Zap" size={16} />
          <span>Sign in with magic link instead</span>
        </button>
      </div>

      {/* Demo Credentials Helper */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 mb-2 font-medium">Demo Credentials:</p>
        <div className="text-xs text-blue-600 space-y-1">
          <p><strong>Free User:</strong> free@voiced.gov / password123</p>
          <p><strong>National User:</strong> national@voiced.gov / password123</p>
          <p><strong>Admin User:</strong> admin@voiced.gov / password123</p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;