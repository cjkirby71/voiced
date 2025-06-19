import React from 'react';
import Icon from 'components/AppIcon';

const ConfirmationModal = ({ isOpen, onClose, tier, currentTier }) => {
  if (!isOpen || !tier) return null;

  const isUpgrade = tier.id === 'national' && currentTier === 'Free';
  const isDowngrade = tier.id === 'free' && currentTier === 'National';

  const getConfirmationContent = () => {
    if (isUpgrade) {
      return {
        icon: 'CheckCircle',
        iconColor: 'text-success',
        title: 'Subscription Activated!',
        message: `Welcome to ${tier.name}! Your subscription has been successfully activated and you now have full access to all platform features.`,
        benefits: [
          'Unlimited article access',
          'Advanced bias analysis',
          'Premium poll insights',
          'Priority support'
        ]
      };
    } else if (isDowngrade) {
      return {
        icon: 'Info',
        iconColor: 'text-primary',
        title: 'Subscription Cancelled',
        message: `Your ${currentTier} Tier subscription has been cancelled. You'll continue to have access until the end of your billing period.`,
        benefits: [
          'Access continues until billing period ends',
          'No further charges will be made',
          'You can resubscribe anytime',
          'Your data and preferences are saved'
        ]
      };
    } else {
      return {
        icon: 'CheckCircle',
        iconColor: 'text-success',
        title: 'Changes Saved',
        message: 'Your subscription preferences have been updated successfully.',
        benefits: []
      };
    }
  };

  const content = getConfirmationContent();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-200 transition-opacity duration-300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg shadow-civic-lg max-w-md w-full">
          {/* Content */}
          <div className="p-6 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
              <Icon name={content.icon} size={32} className={content.iconColor} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
              {content.title}
            </h2>

            {/* Message */}
            <p className="text-text-secondary mb-6">
              {content.message}
            </p>

            {/* Benefits/Details */}
            {content.benefits.length > 0 && (
              <div className="bg-secondary-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-text-primary mb-3 text-center">
                  {isUpgrade ? 'What you get:' : 'Important details:'}
                </h3>
                <ul className="space-y-2">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Icon name="Check" size={14} className="text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {isUpgrade && (
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-primary mb-2">Next Steps</h3>
                <p className="text-sm text-primary">
                  Explore the journalism hub with unlimited access and check out the advanced bias analysis features.
                </p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Icon name="ArrowRight" size={16} />
              <span>
                {isUpgrade ? 'Start Exploring' : 'Continue'}
              </span>
            </button>

            {/* Additional Actions */}
            {isUpgrade && (
              <div className="mt-4 space-y-2">
                <button className="text-sm text-primary hover:text-primary-700 underline">
                  View Billing Details
                </button>
                <br />
                <button className="text-sm text-text-muted hover:text-text-secondary">
                  Download Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;