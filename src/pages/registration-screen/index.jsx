// src/pages/registration-screen/index.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import SocialSignupButtons from './components/SocialSignupButtons';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const totalSteps = 2;

  const handleRegistration = (userData) => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration data:', userData);
      setIsLoading(false);
      setEmailVerificationSent(true);
      // Navigate to verification screen or login after a delay
      setTimeout(() => {
        navigate('/login-screen');
      }, 3000);
    }, 2000);
  };

  const handleSocialSignup = (provider) => {
    setIsLoading(true);
    setError('');
    
    // Simulate social signup
    setTimeout(() => {
      console.log(`Signing up with ${provider}`);
      setIsLoading(false);
      navigate('/home-dashboard');
    }, 2000);
  };

  const resendVerification = () => {
    // Simulate resend verification email
    console.log('Resending verification email...');
  };

  if (emailVerificationSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-surface rounded-xl shadow-civic-lg border border-border p-8 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Mail" size={32} className="text-success-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
              Check Your Email
            </h2>
            <p className="text-text-secondary mb-6">
              We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
            </p>
            <button
              onClick={resendVerification}
              className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200 mb-4"
            >
              Resend verification email
            </button>
            <div className="text-sm text-text-muted">
              Didn't receive the email? Check your spam folder or{' '}
              <Link to="/login-screen" className="text-primary hover:text-primary-700">
                return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-200">
          <div className="bg-surface rounded-lg p-8 flex items-center space-x-4">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-text-primary font-medium">Creating your account...</span>
          </div>
        </div>
      )}

      <div className="max-w-lg w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Vote" size={32} color="white" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Join Voiced
          </h1>
          <p className="text-text-secondary">
            Create your account to participate in democratic transparency
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 === currentStep
                  ? 'bg-primary text-white'
                  : index + 1 < currentStep
                  ? 'bg-success text-white' :'bg-secondary-200 text-text-muted'
              }`}>
                {index + 1 < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div className={`w-12 h-1 mx-2 ${
                  index + 1 < currentStep ? 'bg-success' : 'bg-secondary-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Registration Card */}
        <div className="bg-surface rounded-xl shadow-civic-lg border border-border p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-lg flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error-600" />
              <span className="text-error-600 text-sm">{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <RegistrationForm
            onSubmit={handleRegistration}
            isLoading={isLoading}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onShowTerms={() => setShowTermsModal(true)}
            onShowPrivacy={() => setShowPrivacyModal(true)}
          />

          {/* Divider - Only show on first step */}
          {currentStep === 1 && (
            <>
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-text-muted text-sm">or</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Social Signup */}
              <SocialSignupButtons onSocialSignup={handleSocialSignup} isLoading={isLoading} />
            </>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login-screen"
                className="text-primary hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Mission */}
        <div className="text-center pt-4">
          <p className="text-xs text-text-muted">
            Building democracy through citizen engagement and transparency
          </p>
        </div>
      </div>

      {/* Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
};

export default RegistrationScreen;