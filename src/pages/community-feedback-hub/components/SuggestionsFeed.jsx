import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';

const SuggestionsFeed = ({ filter = 'popularity', category = 'all', onSendToRep = () => {} }) => {
  const [userVotes, setUserVotes] = useState({});
  const [votingStates, setVotingStates] = useState({});

  // Mock suggestions data
  const suggestions = [
    {
      id: 1,
      title: "Increase Transparency in Federal Budget Allocation",
      description: `We need better visibility into how federal tax dollars are being allocated across different departments and programs. Citizens deserve to know exactly where their money is going and how effectively it's being used. This could include real-time budget tracking dashboards and quarterly spending reports that are easily accessible to the public.`,
      category: "federal-policy",
      priority: "high",
      author: "Sarah Johnson",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      upvotes: 1247,
      downvotes: 89,
      trending: true
    },
    {
      id: 2,
      title: "Investigate Healthcare Price Transparency Issues",
      description: `Healthcare costs continue to rise without clear explanations. We need investigative journalism to examine why medical procedures and medications cost significantly more in the US compared to other developed countries. This investigation should include pharmaceutical pricing, hospital billing practices, and insurance company profit margins.`,
      category: "investigative-requests",
      priority: "urgent",
      author: "Michael Chen",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      upvotes: 892,
      downvotes: 156,
      trending: true
    },
    {
      id: 3,
      title: "Local Infrastructure Investment Priorities",
      description: `Our community needs better coordination between federal infrastructure spending and local needs. We should have more input on which roads, bridges, and public transportation projects receive federal funding. Local communities know their infrastructure needs best and should have a stronger voice in these decisions.`,
      category: "local-issues",
      priority: "medium",
      author: "David Rodriguez",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      upvotes: 634,
      downvotes: 78,
      trending: false
    },
    {
      id: 4,
      title: "Climate Change Adaptation Funding",
      description: `Federal climate adaptation funding needs to be more accessible to smaller communities. Many rural and suburban areas are experiencing increased flooding, drought, and extreme weather but lack the resources to apply for complex federal grant programs. We need simplified application processes and dedicated support for smaller municipalities.`,
      category: "environment",
      priority: "high",
      author: "Emily Watson",
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      upvotes: 567,
      downvotes: 123,
      trending: false
    },
    {
      id: 5,
      title: "Student Loan Interest Rate Reform",
      description: `Federal student loan interest rates should be tied to actual government borrowing costs rather than arbitrary rates set by Congress. Current rates are often higher than what the government pays to borrow money, essentially creating profit from student debt. This policy change could save millions of borrowers thousands of dollars.`,
      category: "education",
      priority: "high",
      author: "Alex Thompson",
      submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      upvotes: 1089,
      downvotes: 234,
      trending: false
    },
    {
      id: 6,
      title: "Small Business Federal Contract Access",
      description: `The federal contracting process heavily favors large corporations, making it nearly impossible for small businesses to compete. We need reforms that reserve a meaningful percentage of federal contracts for small businesses and simplify the bidding process. This would create jobs and promote competition.`,
      category: "economy",
      priority: "medium",
      author: "Jennifer Lee",
      submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      upvotes: 445,
      downvotes: 67,
      trending: false
    }
  ];

  const filteredSuggestions = useMemo(() => {
    let filtered = suggestions;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.category === category);
    }

    // Sort by filter type
    switch (filter) {
      case 'popularity':
        return filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'recent':
        return filtered.sort((a, b) => b.submittedAt - a.submittedAt);
      case 'trending':
        return filtered.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        });
      default:
        return filtered;
    }
  }, [filter, category]);

  const handleVote = async (suggestionId, voteType) => {
    // Prevent multiple votes while processing
    if (votingStates[suggestionId]) return;

    setVotingStates(prev => ({ ...prev, [suggestionId]: true }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setUserVotes(prev => ({
      ...prev,
      [suggestionId]: voteType
    }));

    setVotingStates(prev => ({ ...prev, [suggestionId]: false }));
  };

  const getVoteCount = (suggestion, voteType) => {
    const userVote = userVotes[suggestion.id];
    const baseCount = voteType === 'up' ? suggestion.upvotes : suggestion.downvotes;
    
    if (userVote === voteType) {
      return baseCount + 1;
    }
    return baseCount;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'federal-policy': 'Federal Policy',
      'local-issues': 'Local Issues',
      'investigative-requests': 'Investigative Requests',
      'healthcare': 'Healthcare',
      'economy': 'Economy',
      'environment': 'Environment',
      'education': 'Education'
    };
    return categoryMap[category] || category;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-error-100 text-error-700';
      case 'high':
        return 'bg-warning-100 text-warning-700';
      case 'medium':
        return 'bg-primary-100 text-primary-700';
      case 'low':
        return 'bg-secondary-100 text-secondary-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  if (filteredSuggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="MessageSquare" size={32} className="text-secondary-500" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          No Suggestions Found
        </h3>
        <p className="text-text-secondary">
          {category !== 'all' 
            ? `No suggestions found in the ${getCategoryLabel(category)} category.`
            : 'No suggestions match your current filter.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Community Suggestions
        </h2>
        <span className="text-sm text-text-secondary">
          {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-surface rounded-lg shadow-civic border border-border p-6 hover:shadow-civic-md transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    {suggestion.title}
                  </h3>
                  {suggestion.trending && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      <Icon name="TrendingUp" size={12} />
                      <span>Trending</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>by {suggestion.author}</span>
                  <span>•</span>
                  <span>{formatDate(suggestion.submittedAt)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryLabel(suggestion.category)}`}>
                    {getCategoryLabel(suggestion.category)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary mb-6 leading-relaxed">
              {suggestion.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {/* Voting */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(suggestion.id, 'up')}
                    disabled={votingStates[suggestion.id]}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      userVotes[suggestion.id] === 'up' ?'bg-success-100 text-success-700' :'text-text-secondary hover:text-success-600 hover:bg-success-50'
                    } ${votingStates[suggestion.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon 
                      name={votingStates[suggestion.id] ? "Loader2" : "ChevronUp"} 
                      size={16} 
                      className={votingStates[suggestion.id] ? "animate-spin" : ""}
                    />
                    <span>{getVoteCount(suggestion, 'up')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(suggestion.id, 'down')}
                    disabled={votingStates[suggestion.id]}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      userVotes[suggestion.id] === 'down'
                        ? 'bg-error-100 text-error-700' :'text-text-secondary hover:text-error-600 hover:bg-error-50'
                    } ${votingStates[suggestion.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon 
                      name={votingStates[suggestion.id] ? "Loader2" : "ChevronDown"} 
                      size={16} 
                      className={votingStates[suggestion.id] ? "animate-spin" : ""}
                    />
                    <span>{getVoteCount(suggestion, 'down')}</span>
                  </button>
                </div>

                {/* Net Score */}
                <div className="text-sm text-text-muted">
                  Net: +{getVoteCount(suggestion, 'up') - getVoteCount(suggestion, 'down')}
                </div>
              </div>

              {/* Send to Rep Button */}
              <button
                onClick={() => onSendToRep(suggestion)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
              >
                <Icon name="Send" size={16} />
                <span>Send to Rep</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsFeed;