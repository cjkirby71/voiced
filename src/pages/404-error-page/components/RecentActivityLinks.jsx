// src/pages/404-error-page/components/RecentActivityLinks.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const RecentActivityLinks = () => {
  // Mock recent activity data - in real app this would come from user context/API
  const recentActivity = [
    {
      id: 1,
      title: 'Federal Healthcare Policy Poll',
      type: 'poll',
      path: '/polling-interface',
      timestamp: '2 hours ago',
      icon: 'BarChart3'
    },
    {
      id: 2,
      title: 'Congressional Budget Analysis',
      type: 'article',
      path: '/journalism-hub',
      timestamp: '5 hours ago',
      icon: 'Newspaper'
    },
    {
      id: 3,
      title: 'Infrastructure Feedback Thread',
      type: 'feedback',
      path: '/community-feedback-hub',
      timestamp: '1 day ago',
      icon: 'MessageCircle'
    }
  ];

  if (recentActivity.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-heading font-semibold text-text-primary mb-3">
        Your Recent Activity
      </h3>
      <div className="space-y-2">
        {recentActivity.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 hover:border-secondary-300 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
              <Icon name={item.icon} size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors duration-200">
                {item.title}
              </p>
              <p className="text-xs text-text-muted">
                {item.timestamp}
              </p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-text-muted group-hover:text-primary transition-colors duration-200" />
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <Link
          to="/home-dashboard"
          className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
        >
          View all activity →
        </Link>
      </div>
    </div>
  );
};

export default RecentActivityLinks;