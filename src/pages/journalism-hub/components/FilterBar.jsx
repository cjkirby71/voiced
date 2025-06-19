import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedSource,
  onSourceChange,
  selectedCategory,
  onCategoryChange,
  sources,
  categories,
  placeholder = "Search articles...",
  sourceLabel = "Source"
}) => {
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const clearAllFilters = () => {
    onSearchChange('');
    onSourceChange('all');
    onCategoryChange('all');
  };

  const hasActiveFilters = searchTerm || selectedSource !== 'all' || selectedCategory !== 'all';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={16} className="text-text-muted" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Source Filter */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200"
          >
            <span>
              {sourceLabel}: {sources.find(s => s.value === selectedSource)?.label}
            </span>
            <Icon name={isSourceDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
          
          {isSourceDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-civic-lg z-10 max-h-48 overflow-y-auto">
              {sources.map((source) => (
                <button
                  key={source.value}
                  onClick={() => {
                    onSourceChange(source.value);
                    setIsSourceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    selectedSource === source.value
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  {source.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200"
          >
            <span>
              Category: {categories.find(c => c.value === selectedCategory)?.label}
            </span>
            <Icon name={isCategoryDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
          
          {isCategoryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-civic-lg z-10 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    onCategoryChange(category.value);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    selectedCategory === category.value
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
          >
            <Icon name="X" size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary rounded-full text-xs">
              <span>Search: "{searchTerm}"</span>
              <button onClick={() => onSearchChange('')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {selectedSource !== 'all' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary rounded-full text-xs">
              <span>{sourceLabel}: {sources.find(s => s.value === selectedSource)?.label}</span>
              <button onClick={() => onSourceChange('all')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {selectedCategory !== 'all' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary rounded-full text-xs">
              <span>Category: {categories.find(c => c.value === selectedCategory)?.label}</span>
              <button onClick={() => onCategoryChange('all')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;