import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertTriangle" size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-4">
            404
          </h1>
          <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/home-dashboard"
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Icon name="Home" size={20} />
            <span>Go to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors duration-200"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;