// src/pages/404-error-page/components/SearchWidget.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const SearchWidget = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions] = useState([
    { label: 'Polling Interface', path: '/polling-interface', icon: 'BarChart3' },
    { label: 'Journalism Hub', path: '/journalism-hub', icon: 'Newspaper' },
    { label: 'Community Feedback', path: '/community-feedback-hub', icon: 'MessageCircle' },
    { label: 'Representative Contact', path: '/user-profile-representative-contact', icon: 'Users' },
    { label: 'Subscription Management', path: '/subscription-management', icon: 'CreditCard' },
    { label: 'Home Dashboard', path: '/home-dashboard', icon: 'Home' }
  ]);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to journalism hub with search term as query param
      navigate(`/journalism-hub?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-text-muted" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for polls, articles, representatives..."
            className="block w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-surface"
          />
        </div>
        
        {searchTerm && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-civic-lg z-50">
            <div className="p-2">
              <p className="text-xs text-text-muted mb-2 px-2">Quick Access</p>
              {filteredSuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.path)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-colors duration-200"
                >
                  <Icon name={suggestion.icon} size={16} className="text-primary" />
                  <span>{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchWidget;