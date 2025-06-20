// src/pages/registration-screen/components/RegistrationForm.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const RegistrationForm = ({ 
  currentStep, 
  setCurrentStep, 
  onShowTerms, 
  onShowPrivacy 
}) => {
  const { signUp, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    zipCode: '',
    phoneNumber: '',
    smsNotifications: false,
    emailNotifications: true,
    termsAccepted: false,
    privacyAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Weak', color: 'text-error-600' };
      case 2:
      case 3:
        return { text: 'Medium', color: 'text-warning-600' };
      case 4:
      case 5:
        return { text: 'Strong', color: 'text-success-600' };
      default:
        return { text: 'Weak', color: 'text-error-600' };
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required for representative matching';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    if (formData.phoneNumber && !/^[\+]?[1-9][\d]{0,14}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms of Service';
    }
    
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      handleNext();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const result = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        zipCode: formData.zipCode,
        phoneNumber: formData.phoneNumber,
        smsNotifications: formData.smsNotifications,
        emailNotifications: formData.emailNotifications,
        tier: 'free' // Default tier for new users
      });

      if (result.success) {
        // Redirect will be handled by auth state change or show confirmation
        console.log('Registration successful');
      }
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthIndicator = getPasswordStrengthText(passwordStrength);

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

      {currentStep === 1 && (
        <>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="User" size={20} className="text-text-muted" />
              </div>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.fullName ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>
            {errors.fullName && (
              <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Mail" size={20} className="text-text-muted" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Lock" size={20} className="text-text-muted" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
                }`}
                placeholder="Create a password"
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
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength <= 1 ? 'bg-error-500' :
                        passwordStrength <= 3 ? 'bg-warning-500' : 'bg-success-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${strengthIndicator.color}`}>
                    {strengthIndicator.text}
                  </span>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Lock" size={20} className="text-text-muted" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.confirmPassword ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
                }`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors duration-200"
                disabled={isLoading}
              >
                <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          {/* ZIP Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-text-primary mb-2">
              ZIP Code *
              <span className="text-xs text-text-muted ml-1">(for representative matching)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="MapPin" size={20} className="text-text-muted" />
              </div>
              <input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.zipCode ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
                }`}
                placeholder="12345 or 12345-6789"
                disabled={isLoading}
              />
            </div>
            {errors.zipCode && (
              <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.zipCode}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-primary mb-2">
              Phone Number
              <span className="text-xs text-text-muted ml-1">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Phone" size={20} className="text-text-muted" />
              </div>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.phoneNumber ? 'border-error-500 bg-error-50' : 'border-border bg-surface hover:border-border-dark'
                }`}
                placeholder="(555) 123-4567"
                disabled={isLoading}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-error-600 flex items-center space-x-1">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.phoneNumber}</span>
              </p>
            )}
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text-primary">
              Communication Preferences
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  disabled={isLoading}
                />
                <span className="text-sm text-text-primary">
                  Email notifications about polls and updates
                </span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  disabled={isLoading}
                />
                <span className="text-sm text-text-primary">
                  SMS notifications for urgent updates
                </span>
              </label>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                className={`w-4 h-4 mt-0.5 text-primary border-border rounded focus:ring-primary focus:ring-2 ${
                  errors.termsAccepted ? 'border-error-500' : ''
                }`}
                disabled={isLoading}
              />
              <span className="text-sm text-text-primary">
                I accept the{' '}
                <button
                  type="button"
                  onClick={onShowTerms}
                  className="text-primary hover:text-primary-700 underline"
                >
                  Terms of Service
                </button>
                {' '}*
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-sm text-error-600 flex items-center space-x-1 ml-7">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.termsAccepted}</span>
              </p>
            )}
            
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                className={`w-4 h-4 mt-0.5 text-primary border-border rounded focus:ring-primary focus:ring-2 ${
                  errors.privacyAccepted ? 'border-error-500' : ''
                }`}
                disabled={isLoading}
              />
              <span className="text-sm text-text-primary">
                I accept the{' '}
                <button
                  type="button"
                  onClick={onShowPrivacy}
                  className="text-primary hover:text-primary-700 underline"
                >
                  Privacy Policy
                </button>
                {' '}*
              </span>
            </label>
            {errors.privacyAccepted && (
              <p className="text-sm text-error-600 flex items-center space-x-1 ml-7">
                <Icon name="AlertCircle" size={16} />
                <span>{errors.privacyAccepted}</span>
              </p>
            )}
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {currentStep === 2 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="flex-1 py-3 px-4 border border-border text-text-primary font-medium rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 min-h-12"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Back</span>
          </button>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 min-h-12"
        >
          {isLoading ? (
            <Icon name="Loader2" size={20} className="animate-spin" />
          ) : currentStep === 1 ? (
            <>
              <span>Continue</span>
              <Icon name="ArrowRight" size={20} />
            </>
          ) : (
            <>
              <Icon name="UserPlus" size={20} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;