import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ArticleCard = ({ 
  article, 
  onSendToRep,
  showBiasIndicator = false,
  showSource = false,
  showAuthor = false,
  showFunding = false,
  showDonation = false
}) => {
  const [donationAmount, setDonationAmount] = useState(null);
  const [isDonating, setIsDonating] = useState(false);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getBiasColor = (percentage) => {
    if (percentage <= 10) return 'text-success-600 bg-success-50';
    if (percentage <= 20) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  const getBiasLabel = (percentage) => {
    if (percentage <= 10) return 'Low Bias';
    if (percentage <= 20) return 'Moderate Bias';
    return 'High Bias';
  };

  const handleDonation = async (amount) => {
    setDonationAmount(amount);
    setIsDonating(true);
    
    // Simulate donation processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsDonating(false);
    setDonationAmount(null);
    
    // Show success feedback
    alert(`Thank you for your $${amount} donation to support independent journalism!`);
  };

  const getDonationProgress = () => {
    if (!article.donationGoal || !article.donationCurrent) return 0;
    return Math.min((article.donationCurrent / article.donationGoal) * 100, 100);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-civic-md transition-all duration-200 civic-hover-lift">
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.headline}
          className="w-full h-full object-cover"
        />
        
        {/* Bias Indicator */}
        {showBiasIndicator && article.biasPercentage !== undefined && (
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getBiasColor(article.biasPercentage)}`}>
              {article.biasPercentage}% {getBiasLabel(article.biasPercentage)}
            </div>
          </div>
        )}

        {/* Source Logo */}
        {showSource && article.sourceLogo && (
          <div className="absolute top-3 left-3 bg-white rounded-lg p-2 shadow-civic">
            <Image
              src={article.sourceLogo}
              alt={article.source}
              className="h-6 w-auto"
            />
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Author Info */}
        {showAuthor && article.author && (
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={article.authorImage}
              alt={article.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-text-primary text-sm">{article.author}</div>
              <div className="text-text-muted text-xs">{article.publication}</div>
            </div>
          </div>
        )}

        {/* Headline */}
        <h3 className="font-heading font-semibold text-lg text-text-primary mb-3 line-clamp-2">
          {article.headline}
        </h3>

        {/* Excerpt */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Funding Status */}
        {showFunding && article.fundingStatus && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={14} className="text-text-muted" />
              <span className="text-xs font-medium text-text-primary">
                {article.fundingStatus}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {article.fundingDetails}
            </p>
          </div>
        )}

        {/* Donation Progress */}
        {showDonation && article.donationGoal && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-text-muted mb-2">
              <span>Funding Goal</span>
              <span>${article.donationCurrent} / ${article.donationGoal}</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getDonationProgress()}%` }}
              />
            </div>
          </div>
        )}

        {/* Donation Buttons */}
        {showDonation && (
          <div className="mb-4">
            <div className="flex space-x-2 mb-2">
              {[1, 2, 5].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonation(amount)}
                  disabled={isDonating}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 ${
                    donationAmount === amount && isDonating
                      ? 'bg-primary text-white' :'border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  {donationAmount === amount && isDonating ? (
                    <Icon name="Loader2" size={12} className="animate-spin mx-auto" />
                  ) : (
                    `$${amount}`
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Article Meta */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-4">
          <div className="flex items-center space-x-4">
            {showSource && (
              <span>{article.source}</span>
            )}
            <span>{formatTimeAgo(article.publishedAt)}</span>
            <span className="px-2 py-1 bg-secondary-100 rounded-full">
              {article.category}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium text-center flex items-center justify-center space-x-2"
          >
            <Icon name="ExternalLink" size={14} />
            <span>Read Full Article</span>
          </a>
          
          <button
            onClick={() => onSendToRep(article)}
            className="px-4 py-2 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
          >
            <Icon name="Send" size={14} />
            <span className="hidden sm:inline">Send to Rep</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;