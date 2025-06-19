// src/pages/admin-dashboard/components/ContentModeration.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ContentModeration = ({ adminRole }) => {
  const [activeTab, setActiveTab] = useState('articles');
  const [filterStatus, setFilterStatus] = useState('pending');

  // Mock content data
  const contentItems = {
    articles: [
      {
        id: 1,
        title: 'Federal Budget Analysis 2024',
        author: 'John Reporter',
        source: 'Independent Media',
        status: 'pending',
        flaggedReason: 'Potential bias detected',
        biasScore: 65,
        submittedAt: '2024-01-20 10:30',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
      },
      {
        id: 2,
        title: 'Healthcare Reform Updates',
        author: 'Sarah Journalist',
        source: 'Legacy Media',
        status: 'approved',
        flaggedReason: null,
        biasScore: 25,
        submittedAt: '2024-01-20 09:15',
        content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'
      }
    ],
    suggestions: [
      {
        id: 1,
        title: 'Add polling feature for local elections',
        author: 'community_user_123',
        category: 'Feature Request',
        status: 'pending',
        votes: 45,
        submittedAt: '2024-01-20 14:20',
        description: 'It would be great to have polling capabilities for local elections...'
      },
      {
        id: 2,
        title: 'Improve article search functionality',
        author: 'engaged_citizen',
        category: 'Improvement',
        status: 'approved',
        votes: 32,
        submittedAt: '2024-01-20 11:45',
        description: 'The current search could be enhanced with better filtering options...'
      }
    ],
    flagged: [
      {
        id: 1,
        type: 'comment',
        content: 'This article is clearly biased and misleading!',
        author: 'angry_user',
        flaggedBy: 'concerned_citizen',
        reason: 'Inappropriate language',
        status: 'pending',
        flaggedAt: '2024-01-20 16:30'
      }
    ]
  };

  const tabs = [
    { id: 'articles', label: 'Article Review', icon: 'Newspaper', count: contentItems?.articles?.filter(item => item?.status === 'pending')?.length },
    { id: 'suggestions', label: 'Community Suggestions', icon: 'MessageSquare', count: contentItems?.suggestions?.filter(item => item?.status === 'pending')?.length },
    { id: 'flagged', label: 'Flagged Content', icon: 'AlertTriangle', count: contentItems?.flagged?.filter(item => item?.status === 'pending')?.length }
  ];

  const handleContentAction = (item, action) => {
    console.log(`Performing ${action} on content:`, item?.id);
  };

  const getBiasScoreColor = (score) => {
    if (score < 30) return 'text-success bg-success-100';
    if (score < 60) return 'text-warning bg-warning-100';
    return 'text-error bg-error-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success-50';
      case 'rejected': return 'text-error bg-error-50';
      case 'pending': return 'text-warning bg-warning-50';
      default: return 'text-text-secondary bg-secondary-100';
    }
  };

  const renderArticleReview = () => {
    const filteredArticles = contentItems?.articles?.filter(article => 
      filterStatus === 'all' || article?.status === filterStatus
    );

    return (
      <div className="space-y-4">
        {filteredArticles?.map((article) => (
          <div key={article?.id} className="bg-surface border border-border rounded-lg p-6 shadow-civic">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  {article?.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                  <span>By {article?.author}</span>
                  <span>•</span>
                  <span>{article?.source}</span>
                  <span>•</span>
                  <span>{article?.submittedAt}</span>
                </div>
                {article?.flaggedReason && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                    <span className="text-warning text-sm">{article?.flaggedReason}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBiasScoreColor(article?.biasScore)}`}>
                    Bias: {article?.biasScore}%
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(article?.status)}`}>
                  {article?.status}
                </span>
              </div>
            </div>
            
            <p className="text-text-secondary mb-4 line-clamp-3">{article?.content}</p>
            
            <div className="flex items-center justify-between">
              <button
                className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200"
                onClick={() => console.log('View full article')}
              >
                View Full Article
              </button>
              
              {article?.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleContentAction(article, 'approve')}
                    className="px-4 py-2 bg-success text-white text-sm rounded-lg hover:bg-success-600 transition-colors duration-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleContentAction(article, 'reject')}
                    className="px-4 py-2 bg-error text-white text-sm rounded-lg hover:bg-error-600 transition-colors duration-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleContentAction(article, 'override')}
                    className="px-4 py-2 bg-warning text-white text-sm rounded-lg hover:bg-warning-600 transition-colors duration-200"
                  >
                    Override Bias
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSuggestions = () => {
    const filteredSuggestions = contentItems?.suggestions?.filter(suggestion => 
      filterStatus === 'all' || suggestion?.status === filterStatus
    );

    return (
      <div className="space-y-4">
        {filteredSuggestions?.map((suggestion) => (
          <div key={suggestion?.id} className="bg-surface border border-border rounded-lg p-6 shadow-civic">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  {suggestion?.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                  <span>By {suggestion?.author}</span>
                  <span>•</span>
                  <span>{suggestion?.category}</span>
                  <span>•</span>
                  <span>{suggestion?.submittedAt}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Heart" size={14} />
                    <span>{suggestion?.votes} votes</span>
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(suggestion?.status)}`}>
                {suggestion?.status}
              </span>
            </div>
            
            <p className="text-text-secondary mb-4">{suggestion?.description}</p>
            
            {suggestion?.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleContentAction(suggestion, 'approve')}
                  className="px-4 py-2 bg-success text-white text-sm rounded-lg hover:bg-success-600 transition-colors duration-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleContentAction(suggestion, 'reject')}
                  className="px-4 py-2 bg-error text-white text-sm rounded-lg hover:bg-error-600 transition-colors duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleContentAction(suggestion, 'feedback')}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Request More Info
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFlaggedContent = () => {
    const filteredFlagged = contentItems?.flagged?.filter(item => 
      filterStatus === 'all' || item?.status === filterStatus
    );

    return (
      <div className="space-y-4">
        {filteredFlagged?.map((item) => (
          <div key={item?.id} className="bg-surface border border-border rounded-lg p-6 shadow-civic">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                  <span className="text-error font-medium text-sm uppercase">{item?.type} Flagged</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                  <span>By {item?.author}</span>
                  <span>•</span>
                  <span>Flagged by {item?.flaggedBy}</span>
                  <span>•</span>
                  <span>{item?.flaggedAt}</span>
                </div>
                <p className="text-text-secondary mb-2"><strong>Reason:</strong> {item?.reason}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item?.status)}`}>
                {item?.status}
              </span>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-lg mb-4">
              <p className="text-text-primary text-sm">{item?.content}</p>
            </div>
            
            {item?.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleContentAction(item, 'remove')}
                  className="px-4 py-2 bg-error text-white text-sm rounded-lg hover:bg-error-600 transition-colors duration-200"
                >
                  Remove Content
                </button>
                <button
                  onClick={() => handleContentAction(item, 'dismiss')}
                  className="px-4 py-2 bg-success text-white text-sm rounded-lg hover:bg-success-600 transition-colors duration-200"
                >
                  Dismiss Flag
                </button>
                <button
                  onClick={() => handleContentAction(item, 'warn')}
                  className="px-4 py-2 bg-warning text-white text-sm rounded-lg hover:bg-warning-600 transition-colors duration-200"
                >
                  Warn User
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'articles': return renderArticleReview();
      case 'suggestions': return renderSuggestions();
      case 'flagged': return renderFlaggedContent();
      default: return renderArticleReview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.count > 0 && (
                <span className="bg-error text-white text-xs px-2 py-1 rounded-full">
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          {tabs?.find(tab => tab?.id === activeTab)?.label}
        </h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e?.target?.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Content */}
      {renderTabContent()}
    </div>
  );
};

export default ContentModeration;