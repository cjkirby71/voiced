// src/pages/404-error-page/components/NavigationActions.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NavigationActions = () => {
  const navigate = useNavigate();

  const primaryActions = [
    {
      label: 'Home Dashboard',
      path: '/home-dashboard',
      icon: 'Home',
      description: 'Return to your civic engagement hub',
      primary: true
    },
    {
      label: 'Polling Interface',
      path: '/polling-interface',
      icon: 'BarChart3',
      description: 'Participate in government polls',
      primary: false
    },
    {
      label: 'Journalism Hub',
      path: '/journalism-hub',
      icon: 'Newspaper',
      description: 'Access news and analysis',
      primary: false
    }
  ];

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home-dashboard');
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Primary Action Buttons */}
      <div className="space-y-3">
        {primaryActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`w-full flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 group ${
              action.primary
                ? 'bg-primary text-white border-primary hover:bg-primary-700 shadow-civic'
                : 'bg-surface text-text-primary border-border hover:bg-secondary-50 hover:border-secondary-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              action.primary
                ? 'bg-white bg-opacity-20' :'bg-primary-100 group-hover:bg-primary-200'
            } transition-colors duration-200`}>
              <Icon 
                name={action.icon} 
                size={20} 
                className={action.primary ? 'text-white' : 'text-primary'} 
              />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-medium ${
                action.primary ? 'text-white' : 'text-text-primary group-hover:text-primary'
              } transition-colors duration-200`}>
                {action.label}
              </p>
              <p className={`text-sm ${
                action.primary ? 'text-white text-opacity-90' : 'text-text-muted'
              }`}>
                {action.description}
              </p>
            </div>
            <Icon 
              name="ChevronRight" 
              size={16} 
              className={`${
                action.primary ? 'text-white text-opacity-80' : 'text-text-muted group-hover:text-primary'
              } transition-colors duration-200`}
            />
          </Link>
        ))}
      </div>

      {/* Secondary Actions */}
      <div className="pt-4 border-t border-border space-y-2">
        <button
          onClick={handleGoBack}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-text-secondary border border-border rounded-lg hover:text-text-primary hover:bg-secondary-50 hover:border-secondary-300 transition-all duration-200"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Go Back</span>
        </button>
        
        <Link
          to="/community-feedback-hub"
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-primary border border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
        >
          <Icon name="MessageSquare" size={16} />
          <span>Report This Issue</span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationActions;