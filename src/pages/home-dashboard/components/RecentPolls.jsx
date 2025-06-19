import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const RecentPolls = ({ userTier }) => {
  // Mock recent polls data
  const recentPolls = [
    {
      id: 1,
      title: "Federal Infrastructure Investment Act",
      description: "Should Congress allocate $2 trillion for nationwide infrastructure improvements including roads, bridges, and broadband expansion?",
      category: "Infrastructure",
      participants: 15420,
      timeRemaining: "5 days",
      status: "active",
      userVoted: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Healthcare Price Transparency Bill",
      description: "Do you support requiring hospitals and insurance companies to publish all pricing information publicly?",
      category: "Healthcare",
      participants: 8934,
      timeRemaining: "12 days",
      status: "active",
      userVoted: true,
      priority: "medium"
    },
    {
      id: 3,
      title: "Climate Action Framework 2024",
      description: "Should the federal government implement carbon pricing mechanisms to meet 2030 emission reduction targets?",
      category: "Environment",
      participants: 12567,
      timeRemaining: "3 days",
      status: "active",
      userVoted: false,
      priority: "high"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-accent bg-accent-50 border-accent-200';
      case 'medium':
        return 'text-warning bg-warning-50 border-warning-200';
      default:
        return 'text-text-muted bg-secondary-50 border-secondary-200';
    }
  };

  const canParticipate = userTier === 'National' || recentPolls.length <= 1;

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading font-semibold text-text-primary mb-1">
            Active Federal Polls
          </h3>
          <p className="text-sm text-text-secondary">
            Participate in weekly federal polling
          </p>
        </div>
        <Link
          to="/polling-interface"
          className="inline-flex items-center space-x-1 text-primary hover:text-primary-700 text-sm font-medium"
        >
          <span>View All</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {recentPolls.map((poll, index) => {
          const isLocked = !canParticipate && index > 0;
          
          return (
            <div
              key={poll.id}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                isLocked
                  ? 'border-secondary-200 bg-secondary-50 opacity-60'
                  : poll.userVoted
                  ? 'border-success-200 bg-success-50' :'border-border hover:border-primary-300 hover:shadow-civic'
              }`}
            >
              {isLocked && (
                <div className="absolute top-2 right-2">
                  <Icon name="Lock" size={16} className="text-text-muted" />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(poll.priority)}`}>
                      {poll.category}
                    </span>
                    {poll.userVoted && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-success text-white">
                        Voted
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2 line-clamp-2">
                    {poll.title}
                  </h4>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {poll.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-text-muted">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} />
                    <span>{poll.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{poll.timeRemaining} left</span>
                  </div>
                </div>

                {!isLocked && (
                  <Link
                    to="/polling-interface"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      poll.userVoted
                        ? 'bg-success-100 text-success-700 hover:bg-success-200' :'bg-primary text-white hover:bg-primary-700'
                    }`}
                  >
                    {poll.userVoted ? 'View Results' : 'Vote Now'}
                  </Link>
                )}
              </div>

              {isLocked && (
                <div className="mt-3 pt-3 border-t border-secondary-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">
                      Upgrade to participate in all polls
                    </span>
                    <Link
                      to="/subscription-management"
                      className="text-xs text-primary hover:text-primary-700 font-medium"
                    >
                      Upgrade
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Poll Participation Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Your participation: {recentPolls.filter(p => p.userVoted).length} of {recentPolls.length} polls
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-text-muted">Active voter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentPolls;