// src/pages/registration-screen/index.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import RegistrationForm from './components/RegistrationForm';
import SocialSignupButtons from './components/SocialSignupButtons';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';
import Icon from 'components/AppIcon';
import { useAuth } from '../../context/AuthContext';

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/home-dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Create Account - Voiced</title>
        <meta name="description" content="Join Voiced to participate in polls, read exclusive articles, and connect with your representatives." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Icon name="UserPlus" size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Join the Voiced Community
            </h2>
            <p className="text-text-muted">
              Create your account to start engaging with polls and accessing exclusive content
            </p>
            
            {/* Step Indicator */}
            <div className="flex justify-center mt-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  currentStep >= 1 ? 'bg-primary text-white' : 'bg-secondary-200 text-text-muted'
                }`}>
                  1
                </div>
                <div className={`w-8 h-1 rounded transition-colors duration-200 ${
                  currentStep >= 2 ? 'bg-primary' : 'bg-secondary-200'
                }`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  currentStep >= 2 ? 'bg-primary text-white' : 'bg-secondary-200 text-text-muted'
                }`}>
                  2
                </div>
              </div>
            </div>
            
            <div className="text-xs text-text-muted">
              Step {currentStep} of 2: {currentStep === 1 ? 'Account Details' : 'Profile & Preferences'}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-surface p-8 rounded-xl shadow-sm border border-border">
            <RegistrationForm 
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onShowTerms={() => setShowTermsModal(true)}
              onShowPrivacy={() => setShowPrivacyModal(true)}
            />

            {/* Social Auth - Only show on step 1 */}
            {currentStep === 1 && (
              <>
                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-surface text-text-muted">Or continue with</span>
                    </div>
                  </div>
                </div>

                {/* Social Signup */}
                <div className="mt-6">
                  <SocialSignupButtons />
                </div>
              </>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                Already have an account?{' '}
                <Link 
                  to="/login-screen" 
                  className="font-medium text-primary hover:text-primary-700 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Tier Information */}
          <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
              Choose Your Experience
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Check" size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">Free Tier</h4>
                  <p className="text-sm text-text-muted">Access to polls and 1 featured article per month</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Star" size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">National Tier - $5/month</h4>
                  <p className="text-sm text-text-muted">Full access to all polls, articles, and premium features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Help Text */}
          <div className="text-center">
            <p className="text-xs text-text-muted">
              By creating an account, you agree to our{' '}
              <button 
                onClick={() => setShowTermsModal(true)}
                className="text-primary hover:text-primary-700 underline"
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button 
                onClick={() => setShowPrivacyModal(true)}
                className="text-primary hover:text-primary-700 underline"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </>
  );
};

export default RegistrationScreen;