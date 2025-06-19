import React from 'react';
import Icon from 'components/AppIcon';

const FilterChips = ({ options = [], selected, onSelect }) => {
  // Early return if no options provided
  if (!options || !Array.isArray(options) || options.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Desktop Filter Chips */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {options?.map((option) => (
          <button
            key={option?.value}
            onClick={() => onSelect?.(option?.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              selected === option?.value
                ? 'bg-primary text-white shadow-civic'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50'
            }`}
          >
            <span>{option?.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              selected === option?.value
                ? 'bg-white bg-opacity-20 text-white' :'bg-secondary-100 text-text-muted'
            }`}>
              {option?.count}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="sm:hidden">
        <div className="relative">
          <select
            value={selected}
            onChange={(e) => onSelect?.(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-surface appearance-none"
          >
            {options?.map?.((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label} ({option?.count})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon name="ChevronDown" size={16} className="text-text-muted" />
          </div>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {selected !== 'all' && (
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Filtered by:</span>
          <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary rounded-full text-sm">
            <span>{options?.find?.(opt => opt?.value === selected)?.label}</span>
            <button
              onClick={() => onSelect?.('all')}
              className="hover:bg-primary-100 rounded-full p-0.5 transition-colors duration-200"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterChips;