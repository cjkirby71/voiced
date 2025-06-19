import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const GlobalSearchFilter = ({ className = '' }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualFilters = () => {
    switch (location.pathname) {
      case '/journalism-hub':
        return [
          { value: 'all', label: 'All News' },
          { value: 'legacy', label: 'Legacy Media' },
          { value: 'independent', label: 'Independent' },
          { value: 'breaking', label: 'Breaking News' },
          { value: 'analysis', label: 'Analysis' }
        ];
      case '/polling-interface':
        return [
          { value: 'all', label: 'All Polls' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
          { value: 'federal', label: 'Federal' },
          { value: 'state', label: 'State' },
          { value: 'local', label: 'Local' }
        ];
      case '/community-feedback-hub':
        return [
          { value: 'all', label: 'All Topics' },
          { value: 'trending', label: 'Trending' },
          { value: 'recent', label: 'Recent' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'economy', label: 'Economy' },
          { value: 'environment', label: 'Environment' }
        ];
      default:
        return [
          { value: 'all', label: 'All Content' },
          { value: 'news', label: 'News' },
          { value: 'polls', label: 'Polls' },
          { value: 'feedback', label: 'Feedback' }
        ];
    }
  };

  const getPlaceholderText = () => {
    switch (location.pathname) {
      case '/journalism-hub':
        return 'Search news articles, topics, sources...';
      case '/polling-interface':
        return 'Search polls by topic, date, or status...';
      case '/community-feedback-hub':
        return 'Search feedback topics, categories...';
      default:
        return 'Search across all content...';
    }
  };

  const filters = getContextualFilters();
  const placeholder = getPlaceholderText();

  const shouldShowSearchFilter = () => {
    const searchPages = ['/journalism-hub', '/polling-interface', '/community-feedback-hub'];
    return searchPages.includes(location.pathname);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchTerm, 'with filter:', selectedFilter);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedFilter('all');
  };

  useEffect(() => {
    setSearchTerm('');
    setSelectedFilter('all');
    setIsExpanded(false);
  }, [location.pathname]);

  if (!shouldShowSearchFilter()) {
    return null;
  }

  return (
    <div className={`bg-surface border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={20} className="text-text-muted" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="block w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-background"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon name="X" size={16} className="text-text-muted hover:text-text-secondary" />
              </button>
            )}
          </div>

          {/* Filter Tabs - Desktop */}
          <div className="hidden sm:flex space-x-1 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedFilter === filter.value
                    ? 'bg-primary text-white shadow-civic'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Filter Dropdown - Mobile */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50"
            >
              <span>Filter: {filters.find(f => f.value === selectedFilter)?.label}</span>
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
            
            {isExpanded && (
              <div className="mt-2 border border-border rounded-lg bg-surface shadow-civic">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(filter.value);
                      setIsExpanded(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                      selectedFilter === filter.value
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Results Count */}
          {searchTerm && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>Searching in: {filters.find(f => f.value === selectedFilter)?.label}</span>
              <span>Press Enter to search</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GlobalSearchFilter;