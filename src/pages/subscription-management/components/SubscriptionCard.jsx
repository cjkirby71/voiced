import React from 'react';
import Icon from 'components/AppIcon';

const SubscriptionCard = ({ tier, currentTier, onSelect }) => {
  const isCurrentTier = currentTier === tier.name.split(' ')[0];
  const isUpgrade = tier.id === 'national' && currentTier === 'Free';

  return (
    <div className={`relative bg-surface rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-civic-md ${
      tier.popular 
        ? 'border-primary shadow-civic' 
        : isCurrentTier 
          ? 'border-success' :'border-border hover:border-secondary-300'
    }`}>
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentTier && (
        <div className="absolute -top-3 right-4">
          <div className="bg-success text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Icon name="Check" size={12} />
            <span>Current</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
          {tier.name}
        </h3>
        <p className="text-text-secondary text-sm mb-4">
          {tier.description}
        </p>
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-3xl font-heading font-bold text-text-primary">
            ${tier.price}
          </span>
          <span className="text-text-secondary">
            /{tier.period}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {feature.included ? (
                <Icon name="Check" size={16} className="text-success" />
              ) : (
                <Icon name="X" size={16} className="text-text-muted" />
              )}
            </div>
            <span className={`text-sm ${
              feature.included ? 'text-text-primary' : 'text-text-muted'
            }`}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect(tier)}
        disabled={isCurrentTier}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          isCurrentTier
            ? 'bg-secondary-100 text-text-muted cursor-not-allowed'
            : tier.buttonVariant === 'primary' ?'bg-primary text-white hover:bg-primary-700 shadow-civic hover:shadow-civic-md' :'border border-border text-text-secondary hover:bg-secondary-50 hover:text-text-primary'
        }`}
      >
        {isCurrentTier ? (
          <>
            <Icon name="Check" size={16} />
            <span>Current Plan</span>
          </>
        ) : isUpgrade ? (
          <>
            <Icon name="ArrowUp" size={16} />
            <span>{tier.buttonText}</span>
          </>
        ) : (
          <span>{tier.buttonText}</span>
        )}
      </button>

      {/* Upgrade Benefits */}
      {isUpgrade && (
        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center space-x-2 text-primary text-sm font-medium">
            <Icon name="Sparkles" size={16} />
            <span>Upgrade Benefits</span>
          </div>
          <ul className="mt-2 text-xs text-primary space-y-1">
            <li>• Unlimited article access</li>
            <li>• Advanced bias analysis</li>
            <li>• Priority support</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;