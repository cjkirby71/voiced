// src/pages/login-screen/components/MagicLinkForm.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const MagicLinkForm = ({ onSwitchToLogin }) => {
  const { signInWithMagicLink, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const result = await signInWithMagicLink(email);
      
      if (result.success) {
        setSuccess(true);
        setSuccessMessage(result.message || 'Magic link sent! Check your email to sign in.');
      }
    } catch (error) {
      console.log('Magic link error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }

    // Clear success state when user starts typing
    if (success) {
      setSuccess(false);
      setSuccessMessage('');
    }
  };

  // Show success message after magic link is sent
  if (success) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Icon name="Mail" size={32} className="text-white" />
          </div>
        </div>
        
        {/* Success Message */}
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Magic Link Sent!
          </h3>
          <p className="text-text-secondary">
            {successMessage}
          </p>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-medium text-blue-800 mb-1">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your email inbox for the magic link</li>
                <li>• Click the link to automatically sign in</li>
                <li>• The link will expire in 1 hour for security</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setSuccess(false);
              setSuccessMessage('');
              setEmail('');
            }}
            className="w-full py-3 px-4 border border-border text-text-primary font-medium rounded-lg hover:bg-secondary-50 transition-colors duration-200"
          >
            Send Another Magic Link
          </button>
          <button
            onClick={onSwitchToLogin}
            className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Use Password Instead
          </button>
        </div>
      </div>
    );
  }

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

      {/* Magic Link Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Zap" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Magic Link Sign In</h4>
            <p className="text-sm text-blue-700">
              Enter your email address and we'll send you a secure link to sign in instantly - no password required!
            </p>
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="magic-email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={20} className="text-text-muted" />
          </div>
          <input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 min-h-12"
      >
        {isLoading ? (
          <Icon name="Loader2" size={20} className="animate-spin" />
        ) : (
          <>
            <Icon name="Zap" size={20} />
            <span>Send Magic Link</span>
          </>
        )}
      </button>

      {/* Switch to Password Login */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-primary hover:text-primary-700 underline transition-colors duration-200"
          disabled={isLoading}
        >
          Use password instead
        </button>
      </div>
    </form>
  );
};

export default MagicLinkForm;