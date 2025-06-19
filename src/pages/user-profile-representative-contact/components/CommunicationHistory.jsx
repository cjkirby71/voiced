import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CommunicationHistory = ({ history }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'poll_response':
        return 'BarChart3';
      case 'message':
        return 'MessageSquare';
      case 'article_share':
        return 'Share';
      default:
        return 'FileText';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'poll_response':
        return 'Poll Response';
      case 'message':
        return 'Direct Message';
      case 'article_share':
        return 'Article Share';
      default:
        return 'Communication';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'text-success bg-success-50';
      case 'delivered':
        return 'text-primary bg-primary-50';
      case 'read':
        return 'text-warning bg-warning-50';
      default:
        return 'text-text-secondary bg-secondary-100';
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
              Communication History
            </h2>
            <p className="text-text-secondary">
              Track your interactions with representatives
            </p>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="poll_response">Poll Responses</option>
              <option value="message">Messages</option>
              <option value="article_share">Article Shares</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {sortedHistory.length === 0 ? (
          <div className="bg-surface rounded-lg shadow-civic border border-border p-8 text-center">
            <Icon name="MessageSquare" size={48} className="text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-heading font-medium text-text-primary mb-2">
              No Communication History
            </h3>
            <p className="text-text-secondary">
              Start engaging with your representatives by participating in polls or sending messages.
            </p>
          </div>
        ) : (
          sortedHistory.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-lg shadow-civic border border-border p-6 hover:shadow-civic-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Icon name={getTypeIcon(item.type)} size={20} className="text-text-secondary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-heading font-medium text-text-primary mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-text-secondary">
                        <span className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} />
                          <span>{item.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>{item.representative}</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <span className="px-2 py-1 bg-secondary-100 text-text-secondary text-xs rounded-full">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  
                  {item.response && (
                    <div className="mb-3">
                      <span className="text-sm text-text-secondary">Response: </span>
                      <span className="text-sm font-medium text-text-primary">{item.response}</span>
                    </div>
                  )}
                  
                  {item.content && (
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                      {item.content}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200">
                      View Details
                    </button>
                    {item.type === 'message' && (
                      <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-200">
                        Follow Up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Communication Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {history.filter(item => item.type === 'poll_response').length}
            </div>
            <div className="text-sm text-text-secondary">Poll Responses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {history.filter(item => item.type === 'message').length}
            </div>
            <div className="text-sm text-text-secondary">Direct Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {history.filter(item => item.status === 'delivered' || item.status === 'read').length}
            </div>
            <div className="text-sm text-text-secondary">Delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;