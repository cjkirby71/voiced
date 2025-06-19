// src/pages/404-error-page/components/ErrorIllustration.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const ErrorIllustration = () => {
  return (
    <div className="relative w-48 h-32 mx-auto mb-8">
      {/* Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-primary-50 rounded-full opacity-50"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full opacity-70"></div>
      </div>
      
      {/* Government Building Icon */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="w-16 h-16 bg-surface rounded-lg shadow-civic flex items-center justify-center border border-border">
          <Icon name="Building2" size={28} className="text-secondary-400" />
        </div>
      </div>
      
      {/* Search/Question Mark Overlay */}
      <div className="absolute bottom-4 right-8">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-civic">
          <Icon name="HelpCircle" size={20} className="text-white" />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-8 left-8">
        <div className="w-2 h-2 bg-accent rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-8 left-12">
        <div className="w-3 h-3 bg-secondary-300 rounded-full opacity-40"></div>
      </div>
      <div className="absolute top-12 right-12">
        <div className="w-2 h-2 bg-primary-300 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default ErrorIllustration;