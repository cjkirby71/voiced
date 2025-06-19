// src/pages/login-screen/components/LoginForm.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(credentials);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors duration-200"
            disabled={isLoading}
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
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 min-h-12"
      >
        {isLoading ? (
          <Icon name="Loader2" size={20} className="animate-spin" />
        ) : (
          <>
            <Icon name="LogIn" size={20} />
            <span>Sign In</span>
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;