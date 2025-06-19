import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';
import SkeletonCard from './SkeletonCard';

const LegacyMediaSection = ({ onSendToRep }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock RSS data for legacy media
  const mockArticles = [
    {
      id: 1,
      headline: "Federal Budget Negotiations Continue as Deadline Approaches",
      source: "CNN",
      sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/200px-CNN.svg.png",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: "Politics",
      biasPercentage: 15,
      excerpt: `Congressional leaders are working around the clock to reach a bipartisan agreement on the federal budget before the upcoming deadline. Sources close to the negotiations indicate that both parties are making concessions on key spending priorities.

The talks have focused primarily on defense spending, social programs, and infrastructure investments. Republican lawmakers are pushing for increased military funding while Democrats advocate for expanded social safety net programs.`,
      imageUrl: "https://images.unsplash.com/photo-1555848962-6e79363ec5f1?w=800&h=400&fit=crop",
      url: "https://cnn.com/politics/budget-negotiations"
    },
    {
      id: 2,
      headline: "Supreme Court to Hear Major Healthcare Case Next Term",
      source: "Fox News",
      sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/200px-Fox_News_Channel_logo.svg.png",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: "Healthcare",
      biasPercentage: 22,
      excerpt: `The Supreme Court announced it will review a landmark healthcare case that could significantly impact millions of Americans. The case centers on the constitutionality of recent healthcare regulations and their effect on state sovereignty.

Legal experts predict this decision could reshape the healthcare landscape for years to come. The case has drawn attention from advocacy groups on both sides of the political spectrum.`,
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      url: "https://foxnews.com/politics/supreme-court-healthcare"
    },
    {
      id: 3,
      headline: "Infrastructure Bill Implementation Shows Mixed Results Across States",
      source: "Associated Press",
      sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/200px-Associated_Press_logo_2012.svg.png",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: "Infrastructure",
      biasPercentage: 8,
      excerpt: `A comprehensive analysis of the federal infrastructure bill's implementation reveals varying degrees of success across different states. While some regions have seen significant improvements in road and bridge conditions, others face delays and budget overruns.

The report highlights both the challenges and opportunities in executing large-scale federal infrastructure projects. State officials cite coordination issues and supply chain disruptions as primary obstacles.`,
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop",
      url: "https://apnews.com/infrastructure-implementation"
    },
    {
      id: 4,
      headline: "Climate Change Legislation Faces Senate Vote This Week",
      source: "CNN",
      sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/200px-CNN.svg.png",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      category: "Environment",
      biasPercentage: 18,
      excerpt: `The Senate is preparing to vote on comprehensive climate change legislation that would establish new emissions standards and provide funding for renewable energy projects. The bill has garnered support from environmental groups but faces opposition from some industry representatives.

Key provisions include tax incentives for clean energy adoption and stricter regulations on carbon emissions. The legislation represents one of the most significant environmental policy initiatives in recent years.`,
      imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop",
      url: "https://cnn.com/politics/climate-legislation"
    },
    {
      id: 5,
      headline: "Federal Reserve Announces Interest Rate Decision",
      source: "Fox News",
      sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/200px-Fox_News_Channel_logo.svg.png",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      category: "Economy",
      biasPercentage: 12,
      excerpt: `The Federal Reserve has announced its latest interest rate decision, maintaining current rates while signaling potential changes in the coming months. The decision comes amid ongoing concerns about inflation and economic growth.

Fed officials cited mixed economic indicators and global market volatility as factors in their decision-making process. Market analysts are closely watching for signals about future monetary policy direction.`,
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      url: "https://foxnews.com/business/fed-interest-rates"
    },
    {
      id: 6,
      headline: "Border Security Measures Under Congressional Review",
      source: "Associated Press",
      sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/200px-Associated_Press_logo_2012.svg.png",
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      category: "Immigration",
      biasPercentage: 5,
      excerpt: `Congressional committees are conducting a comprehensive review of current border security measures and their effectiveness. The review includes analysis of technology deployment, personnel allocation, and coordination between federal agencies.

Lawmakers from both parties have expressed interest in evidence-based policy recommendations. The review is expected to inform future legislation on immigration and border security.`,
      imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop",
      url: "https://apnews.com/border-security-review"
    }
  ];

  const sources = [
    { value: 'all', label: 'All Sources' },
    { value: 'CNN', label: 'CNN' },
    { value: 'Fox News', label: 'Fox News' },
    { value: 'Associated Press', label: 'Associated Press' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Politics', label: 'Politics' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Economy', label: 'Economy' },
    { value: 'Immigration', label: 'Immigration' }
  ];

  useEffect(() => {
    // Simulate RSS feed loading
    const loadArticles = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setArticles(mockArticles);
      setFilteredArticles(mockArticles);
      setIsLoading(false);
    };

    loadArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by source
    if (selectedSource !== 'all') {
      filtered = filtered.filter(article => article.source === selectedSource);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedSource, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">
            Legacy Media
          </h2>
          <p className="text-text-secondary mt-1">
            RSS-integrated articles from major news outlets with AI bias detection
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-muted">
          <Icon name="Rss" size={16} />
          <span>Live RSS Feed</span>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sources={sources}
        categories={categories}
        placeholder="Search articles by headline or content..."
      />

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSendToRep={onSendToRep}
                  showBiasIndicator={true}
                  showSource={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={24} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No articles found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {!isLoading && filteredArticles.length > 0 && (
        <div className="text-center pt-8">
          <button className="px-6 py-3 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200 flex items-center space-x-2 mx-auto">
            <Icon name="RefreshCw" size={16} />
            <span>Load More Articles</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LegacyMediaSection;