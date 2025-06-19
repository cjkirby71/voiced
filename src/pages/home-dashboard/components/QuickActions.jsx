import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const QuickActions = ({ userTier }) => {
  const quickActions = [
    {
      title: 'Submit Feedback',
      description: 'Share your thoughts on federal policies and legislation',
      icon: 'MessageSquare',
      link: '/community-feedback-hub',
      color: 'bg-primary',
      textColor: 'text-white',
      available: true
    },
    {
      title: 'View Polls',
      description: 'Participate in weekly federal polling initiatives',
      icon: 'BarChart3',
      link: '/polling-interface',
      color: 'bg-success',
      textColor: 'text-white',
      available: true
    },
    {
      title: 'Read News',
      description: 'Access bias-aware journalism from multiple sources',
      icon: 'Newspaper',
      link: '/journalism-hub',
      color: 'bg-warning',
      textColor: 'text-white',
      available: true
    },
    {
      title: 'Contact Representatives',
      description: 'Connect directly with your elected officials',
      icon: 'Phone',
      link: '/user-profile-representative-contact',
      color: 'bg-accent',
      textColor: 'text-white',
      available: true
    },
    {
      title: 'Manage Subscription',
      description: 'Upgrade to National tier for full platform access',
      icon: 'CreditCard',
      link: '/subscription-management',
      color: 'bg-secondary-600',
      textColor: 'text-white',
      available: true,
      highlight: userTier === 'Free'
    },
    {
      title: 'Community Topics',
      description: 'Suggest and vote on important discussion topics',
      icon: 'Users',
      link: '/community-feedback-hub',
      color: 'bg-primary-600',
      textColor: 'text-white',
      available: true
    }
  ];

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-1">
          Quick Actions
        </h3>
        <p className="text-sm text-text-secondary">
          Fast access to key platform features
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`relative group p-6 rounded-lg transition-all duration-200 hover:shadow-civic-md hover:-translate-y-1 ${action.color} ${action.textColor}`}
          >
            {action.highlight && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
            )}

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Icon name={action.icon} size={24} className={action.textColor} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-2 group-hover:underline">
                  {action.title}
                </h4>
                <p className="text-sm opacity-90 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm opacity-75">
                {action.available ? 'Available' : 'Coming Soon'}
              </span>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="group-hover:translate-x-1 transition-transform duration-200" 
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Platform Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-text-primary">47,892</p>
            <p className="text-sm text-text-muted">Active Citizens</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">156</p>
            <p className="text-sm text-text-muted">Active Polls</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">2,341</p>
            <p className="text-sm text-text-muted">News Articles</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">89%</p>
            <p className="text-sm text-text-muted">Transparency Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;