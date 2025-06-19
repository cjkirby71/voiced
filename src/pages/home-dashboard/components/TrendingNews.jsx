import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TrendingNews = ({ userTier }) => {
  // Mock trending news data
  const trendingNews = [
    {
      id: 1,
      title: "Senate Passes Bipartisan Infrastructure Bill with 69-30 Vote",
      excerpt: "The $1.2 trillion infrastructure package includes funding for roads, bridges, broadband, and clean energy initiatives across all 50 states.",
      source: "Associated Press",
      sourceType: "legacy",
      biasScore: 15,
      publishedAt: "2 hours ago",
      category: "Infrastructure",
      imageUrl: "https://images.unsplash.com/photo-1555848962-6e79363ec5f3?w=400&h=200&fit=crop",
      readTime: "4 min read",
      trending: true
    },
    {
      id: 2,
      title: "Federal Reserve Announces Interest Rate Decision Amid Economic Uncertainty",
      excerpt: "The Fed maintains current rates while signaling potential changes based on inflation data and employment figures in upcoming quarters.",
      source: "Reuters",
      sourceType: "legacy",
      biasScore: 8,
      publishedAt: "4 hours ago",
      category: "Economy",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
      readTime: "3 min read",
      trending: false
    },
    {
      id: 3,
      title: "Climate Action Coalition Proposes New Carbon Pricing Framework",
      excerpt: "Independent analysis reveals potential economic impacts of proposed federal carbon pricing mechanisms on various industry sectors.",
      source: "Climate Policy Institute",
      sourceType: "independent",
      biasScore: 22,
      publishedAt: "6 hours ago",
      category: "Environment",
      imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=200&fit=crop",
      readTime: "5 min read",
      trending: true,
      fundingStatus: "Donation Supported",
      donationGoal: 5000,
      donationCurrent: 3200
    }
  ];

  const getBiasColor = (score) => {
    if (score <= 10) return 'text-success bg-success-50 border-success-200';
    if (score <= 25) return 'text-warning bg-warning-50 border-warning-200';
    return 'text-accent bg-accent-50 border-accent-200';
  };

  const getBiasLabel = (score) => {
    if (score <= 10) return 'Low Bias';
    if (score <= 25) return 'Moderate Bias';
    return 'High Bias';
  };

  const canReadAll = userTier === 'National';

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading font-semibold text-text-primary mb-1">
            Trending News
          </h3>
          <p className="text-sm text-text-secondary">
            Bias-aware journalism from multiple sources
          </p>
        </div>
        <Link
          to="/journalism-hub"
          className="inline-flex items-center space-x-1 text-primary hover:text-primary-700 text-sm font-medium"
        >
          <span>View All</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>

      <div className="space-y-6">
        {trendingNews.map((article, index) => {
          const isLocked = !canReadAll && index > 0;
          
          return (
            <article
              key={article.id}
              className={`relative group ${
                isLocked ? 'opacity-60' : ''
              }`}
            >
              {isLocked && (
                <div className="absolute top-2 right-2 z-10">
                  <Icon name="Lock" size={16} className="text-text-muted" />
                </div>
              )}

              <div className="flex space-x-4">
                {/* Article Image */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-24 overflow-hidden rounded-lg">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-text-muted">{article.source}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">{article.publishedAt}</span>
                    {article.trending && (
                      <>
                        <span className="text-xs text-text-muted">•</span>
                        <div className="flex items-center space-x-1">
                          <Icon name="TrendingUp" size={12} className="text-accent" />
                          <span className="text-xs text-accent font-medium">Trending</span>
                        </div>
                      </>
                    )}
                  </div>

                  <h4 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {article.title}
                  </h4>

                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Bias Indicator */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBiasColor(article.biasScore)}`}>
                        {getBiasLabel(article.biasScore)} ({article.biasScore}%)
                      </span>

                      {/* Source Type */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.sourceType === 'independent' ?'bg-primary-50 text-primary border border-primary-200' :'bg-secondary-100 text-text-muted border border-secondary-200'
                      }`}>
                        {article.sourceType === 'independent' ? 'Independent' : 'Legacy Media'}
                      </span>

                      <span className="text-xs text-text-muted">{article.readTime}</span>
                    </div>

                    {!isLocked && (
                      <Link
                        to="/journalism-hub"
                        className="inline-flex items-center space-x-1 text-primary hover:text-primary-700 text-sm font-medium"
                      >
                        <span>Read More</span>
                        <Icon name="ExternalLink" size={14} />
                      </Link>
                    )}
                  </div>

                  {/* Independent Media Funding Status */}
                  {article.sourceType === 'independent' && article.fundingStatus && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-muted">{article.fundingStatus}</span>
                        <span className="text-xs text-text-muted">
                          ${article.donationCurrent} / ${article.donationGoal}
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-1.5 mb-2">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(article.donationCurrent / article.donationGoal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary-700 transition-colors duration-200">
                          $1
                        </button>
                        <button className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary-700 transition-colors duration-200">
                          $3
                        </button>
                        <button className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary-700 transition-colors duration-200">
                          $5
                        </button>
                      </div>
                    </div>
                  )}

                  {isLocked && (
                    <div className="mt-3 pt-3 border-t border-secondary-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">
                          Upgrade to read all articles
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
              </div>
            </article>
          );
        })}
      </div>

      {/* News Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            {canReadAll ? 'Full access' : `${userTier} tier: 1 article per day`}
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-text-muted">Live updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNews;