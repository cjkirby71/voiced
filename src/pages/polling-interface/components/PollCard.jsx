import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import RepresentativeContactQuickAccess from 'components/ui/RepresentativeContactQuickAccess';

const PollCard = ({ poll }) => {
  const [selectedVote, setSelectedVote] = useState(poll?.userVote || '');
  const [whyText, setWhyText] = useState('');
  const [showWhyInput, setShowWhyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactRep, setShowContactRep] = useState(false);

  const handleVoteSubmit = async () => {
    if (!selectedVote) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Show success message or update UI
    console.log('Vote submitted:', { pollId: poll?.id, vote: selectedVote, reason: whyText });
  };

  const getStatusBadge = () => {
    if (poll?.status === 'active') {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-success-50 text-success-600 rounded-full text-xs font-medium">
          <Icon name="Clock" size={12} />
          <span>{poll?.timeRemaining || 'N/A'} remaining</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-secondary-100 text-text-secondary rounded-full text-xs font-medium">
          <Icon name="CheckCircle" size={12} />
          <span>Completed</span>
        </div>
      );
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Healthcare: 'bg-blue-50 text-blue-600',
      Economy: 'bg-green-50 text-green-600',
      Environment: 'bg-emerald-50 text-emerald-600',
      Defense: 'bg-red-50 text-red-600'
    };
    return colors[category] || 'bg-secondary-100 text-text-secondary';
  };

  // Return null or loading state if poll is not available
  if (!poll) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 civic-shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-secondary-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-6 civic-shadow hover:civic-shadow-md civic-transition">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(poll?.category)}`}>
                {poll?.category || 'General'}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
              {poll?.title || 'Poll Title Not Available'}
            </h3>
            <p className="text-sm text-text-muted mb-2">
              {poll?.billNumber || 'N/A'} • Sponsored by {poll?.sponsor || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="mb-4">
          <p className="text-text-primary font-medium mb-3">
            {poll?.question || 'Question not available'}
          </p>
          <div className="text-sm text-text-secondary space-y-1">
            <p>{poll?.description || 'Description not available'}</p>
          </div>
        </div>

        {/* Current Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Current Results</span>
            <span className="text-sm text-text-secondary italic">
              {poll?.totalVotes?.toLocaleString() || '0'} participants
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-text-secondary">Yes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${poll?.results?.yes || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-text-primary italic">
                  {poll?.results?.yes || 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-sm text-text-secondary">No</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full" 
                    style={{ width: `${poll?.results?.no || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-text-primary italic">
                  {poll?.results?.no || 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm text-text-secondary">Maybe</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full" 
                    style={{ width: `${poll?.results?.maybe || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-text-primary italic">
                  {poll?.results?.maybe || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Interface */}
        {poll?.status === 'active' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Vote
              </label>
              <select
                value={selectedVote}
                onChange={(e) => setSelectedVote(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="">Select your position...</option>
                <option value="yes">Yes - I support this legislation</option>
                <option value="no">No - I oppose this legislation</option>
                <option value="maybe">Maybe - I need more information</option>
              </select>
            </div>

            {selectedVote && (
              <div>
                <button
                  onClick={() => setShowWhyInput(!showWhyInput)}
                  className="flex items-center space-x-2 text-sm text-primary hover:text-primary-700 transition-colors duration-200"
                >
                  <Icon name={showWhyInput ? "ChevronUp" : "ChevronDown"} size={16} />
                  <span>Explain your reasoning (optional)</span>
                </button>
                
                {showWhyInput && (
                  <div className="mt-3">
                    <textarea
                      value={whyText}
                      onChange={(e) => setWhyText(e.target.value)}
                      placeholder="Share your thoughts on this legislation..."
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-text-muted mt-1">
                      <span>Your reasoning helps inform other citizens</span>
                      <span>{whyText?.length || 0}/500</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleVoteSubmit}
              disabled={!selectedVote || isSubmitting}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Submitting Vote...</span>
                </>
              ) : (
                <>
                  <Icon name="Vote" size={16} />
                  <span>Submit Vote</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Completed Poll Results */}
        {poll?.status === 'completed' && (
          <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="BarChart3" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">Final Results</span>
            </div>
            <p className="text-sm text-text-secondary italic">
              Results coming soon - Analysis in progress
            </p>
            {poll?.userVote && (
              <div className="mt-2 flex items-center space-x-2">
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-xs text-text-secondary">
                  You voted: <span className="font-medium capitalize">{poll?.userVote}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowContactRep(true)}
            className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="Send" size={16} />
            <span>Send to Rep</span>
          </button>
          <button className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors duration-200 flex items-center justify-center space-x-2">
            <Icon name="Share2" size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Representative Contact Modal */}
      <RepresentativeContactQuickAccess
        isOpen={showContactRep}
        onClose={() => setShowContactRep(false)}
        contentContext={{
          title: poll?.title || 'Poll',
          type: 'poll',
          userPosition: selectedVote
        }}
      />
    </>
  );
};

export default PollCard;