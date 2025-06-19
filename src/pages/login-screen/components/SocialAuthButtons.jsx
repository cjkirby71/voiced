// src/pages/login-screen/components/SocialAuthButtons.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const SocialAuthButtons = ({ onSocialAuth, isLoading }) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome', // Using Chrome as Google icon substitute
      bgColor: 'bg-white',
      textColor: 'text-text-primary',
      borderColor: 'border-border',
      hoverBg: 'hover:bg-secondary-50'
    },
    {
      name: 'Apple',
      icon: 'Apple', // Using generic Apple icon if available, otherwise fallback
      bgColor: 'bg-text-primary',
      textColor: 'text-white',
      borderColor: 'border-text-primary',
      hoverBg: 'hover:bg-secondary-800'
    }
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <button
          key={provider.name}
          onClick={() => onSocialAuth(provider.name.toLowerCase())}
          disabled={isLoading}
          className={`w-full py-3 px-4 border rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-12 ${
            provider.bgColor
          } ${
            provider.textColor
          } ${
            provider.borderColor
          } ${
            provider.hoverBg
          }`}
        >
          <Icon name={provider.icon} size={20} />
          <span>Continue with {provider.name}</span>
        </button>
      ))}
      
      {/* Alternative text for accessibility */}
      <div className="text-center">
        <p className="text-xs text-text-muted mt-4">
          Social authentication provides secure access through trusted platforms
        </p>
      </div>
    </div>
  );
};

export default SocialAuthButtons;