import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const SubscriptionStatusIndicator = ({ tier = 'Free', className = '' }) => {
  const getTierConfig = () => {
    switch (tier) {
      case 'National':
        return {
          label: 'National',
          bgColor: 'bg-primary',
          textColor: 'text-white',
          icon: 'Crown',
          description: 'Full Access'
        };
      case 'Free':
      default:
        return {
          label: 'Free',
          bgColor: 'bg-secondary-200',
          textColor: 'text-text-secondary',
          icon: 'User',
          description: 'Limited Access'
        };
    }
  };

  const config = getTierConfig();

  return (
    <Link
      to="/subscription-management"
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-out hover:shadow-civic ${config.bgColor} ${config.textColor} ${className}`}
    >
      <Icon name={config.icon} size={14} />
      <span className="hidden sm:inline">{config.label}</span>
      <span className="hidden lg:inline">- {config.description}</span>
    </Link>
  );
};

export default SubscriptionStatusIndicator;