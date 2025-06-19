import React from 'react';
import Icon from 'components/AppIcon';

const CurrentSubscriptionStatus = ({ subscriptionData, currentTier }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (used, limit) => {
    if (limit === 'unlimited') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const usageStats = [
    {
      label: 'Articles Read',
      used: subscriptionData.articlesRead,
      limit: subscriptionData.monthlyLimit.articles,
      icon: 'FileText',
      color: subscriptionData.articlesRead >= subscriptionData.monthlyLimit.articles ? 'text-accent' : 'text-primary'
    },
    {
      label: 'Polls Participated',
      used: subscriptionData.pollsParticipated,
      limit: subscriptionData.monthlyLimit.polls,
      icon: 'BarChart3',
      color: 'text-success'
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Current Subscription
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            Your current plan and usage overview
          </p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            currentTier === 'Free' ?'bg-secondary-100 text-text-secondary' :'bg-primary-100 text-primary'
          }`}>
            <Icon name={currentTier === 'Free' ? 'User' : 'Crown'} size={14} />
            <span>{currentTier} Tier</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Subscription Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Plan Type
            </label>
            <div className="flex items-center space-x-2">
              <Icon name={currentTier === 'Free' ? 'User' : 'Crown'} size={16} className="text-text-muted" />
              <span className="text-text-primary font-medium">{currentTier} Tier</span>
            </div>
          </div>
          
          {currentTier !== 'Free' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Next Billing Date
              </label>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-text-muted" />
                <span className="text-text-primary">{formatDate(subscriptionData.renewalDate)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Monthly Cost
            </label>
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={16} className="text-text-muted" />
              <span className="text-text-primary font-medium">
                ${currentTier === 'Free' ? '0.00' : '5.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            This Month's Usage
          </h3>
          <div className="space-y-4">
            {usageStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={stat.icon} size={16} className={stat.color} />
                    <span className="text-sm font-medium text-text-primary">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {stat.used} {stat.limit !== 'unlimited' ? `/ ${stat.limit}` : ''}
                  </span>
                </div>
                
                {stat.limit !== 'unlimited' && (
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        stat.used >= stat.limit ? 'bg-accent' : 'bg-primary'
                      }`}
                      style={{ width: `${getUsagePercentage(stat.used, stat.limit)}%` }}
                    />
                  </div>
                )}
                
                {stat.limit !== 'unlimited' && stat.used >= stat.limit && (
                  <div className="flex items-center space-x-1 text-xs text-accent">
                    <Icon name="AlertTriangle" size={12} />
                    <span>Limit reached - upgrade for unlimited access</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Prompt for Free Users */}
      {currentTier === 'Free' && subscriptionData.articlesRead >= subscriptionData.monthlyLimit.articles && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-primary mb-1">
                Article Limit Reached
              </h4>
              <p className="text-sm text-primary mb-3">
                You've reached your monthly article limit. Upgrade to National Tier for unlimited access to all journalism content.
              </p>
              <button className="text-sm font-medium text-primary hover:text-primary-700 underline">
                View Upgrade Options →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentSubscriptionStatus;