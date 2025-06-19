import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterControls = ({ 
  selectedFilter = 'popularity', 
  selectedCategory = 'all',
  onFilterChange = () => {},
  onCategoryChange = () => {}
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);

  const filterOptions = [
    { value: 'popularity', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'recent', label: 'Most Recent', icon: 'Clock' },
    { value: 'trending', label: 'Trending Now', icon: 'Flame' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { value: 'federal-policy', label: 'Federal Policy', icon: 'Building2' },
    { value: 'local-issues', label: 'Local Issues', icon: 'MapPin' },
    { value: 'investigative-requests', label: 'Investigative Requests', icon: 'Search' },
    { value: 'healthcare', label: 'Healthcare', icon: 'Heart' },
    { value: 'economy', label: 'Economy', icon: 'DollarSign' },
    { value: 'environment', label: 'Environment', icon: 'Leaf' },
    { value: 'education', label: 'Education', icon: 'GraduationCap' }
  ];

  const getSelectedFilterLabel = () => {
    return filterOptions.find(option => option.value === selectedFilter)?.label || 'Filter';
  };

  const getSelectedCategoryLabel = () => {
    return categoryOptions.find(option => option.value === selectedCategory)?.label || 'Category';
  };

  return (
    <div className="bg-surface rounded-lg shadow-civic border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Filter Suggestions
        </h3>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Filter" size={16} />
          <span>Sort & Filter</span>
        </div>
      </div>

      {/* Desktop Filter Chips */}
      <div className="hidden md:block space-y-4">
        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Sort by
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === option.value
                    ? 'bg-primary text-white shadow-civic'
                    : 'bg-secondary-100 text-text-secondary hover:text-text-primary hover:bg-secondary-200'
                }`}
              >
                <Icon name={option.icon} size={16} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Options */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onCategoryChange(option.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === option.value
                    ? 'bg-primary text-white shadow-civic'
                    : 'bg-secondary-100 text-text-secondary hover:text-text-primary hover:bg-secondary-200'
                }`}
              >
                <Icon name={option.icon} size={16} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dropdowns */}
      <div className="md:hidden space-y-4">
        {/* Sort Dropdown */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Sort by
          </label>
          <div className="relative">
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200"
            >
              <span>{getSelectedFilterLabel()}</span>
              <Icon name={isFilterExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
            
            {isFilterExpanded && (
              <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-lg bg-surface shadow-civic-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange(option.value);
                      setIsFilterExpanded(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                      selectedFilter === option.value
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }`}
                  >
                    <Icon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Category
          </label>
          <div className="relative">
            <button
              onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200"
            >
              <span>{getSelectedCategoryLabel()}</span>
              <Icon name={isCategoryExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
            
            {isCategoryExpanded && (
              <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-lg bg-surface shadow-civic-lg z-10 max-h-64 overflow-y-auto">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onCategoryChange(option.value);
                      setIsCategoryExpanded(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                      selectedCategory === option.value
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }`}
                  >
                    <Icon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedFilter !== 'popularity' || selectedCategory !== 'all') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Filter" size={14} />
              <span>Active filters:</span>
              {selectedFilter !== 'popularity' && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                  {getSelectedFilterLabel()}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                  {getSelectedCategoryLabel()}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                onFilterChange('popularity');
                onCategoryChange('all');
              }}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors duration-200"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;