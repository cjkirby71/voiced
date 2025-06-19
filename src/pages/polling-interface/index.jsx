// src/pages/polling-interface/index.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { usePoll } from '../../context/PollContext';
import { useUser } from '../../context/UserContext';
import PollCard from './components/PollCard';
import FilterChips from './components/FilterChips';

const PollingInterface = () => {
  const { 
    polls, 
    isLoading, 
    error, 
    filters, 
    fetchPolls, 
    updateFilters, 
    votePoll,
    hasUserVoted,
    getUserVote,
    clearError
  } = usePoll();
  const { isAuthenticated } = useUser();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Fetch polls on component mount
  useEffect(() => {
    fetchPolls(filters);
  }, []);

  // Update filters when local state changes
  useEffect(() => {
    const newFilters = {
      category: selectedCategory,
      sortBy: sortBy,
      sortOrder: 'desc'
    };
    updateFilters(newFilters);
    fetchPolls(newFilters);
  }, [selectedCategory, sortBy]);

  const handleVote = async (pollId, optionId) => {
    if (!isAuthenticated) {
      alert('Please sign in to vote on polls.');
      return;
    }
    
    const result = await votePoll(pollId, optionId);
    if (!result.success) {
      alert(result.error || 'Failed to vote. Please try again.');
    }
  };

  const filteredPolls = polls?.filter(poll => 
    searchTerm === '' || 
    poll?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categories = [
    { id: 'all', label: 'All Categories', count: polls?.length || 0 },
    { id: 'budget', label: 'Budget & Finance', count: polls?.filter(p => p?.category === 'budget').length || 0 },
    { id: 'environment', label: 'Environment', count: polls?.filter(p => p?.category === 'environment').length || 0 },
    { id: 'technology', label: 'Technology', count: polls?.filter(p => p?.category === 'technology').length || 0 },
    { id: 'healthcare', label: 'Healthcare', count: polls?.filter(p => p?.category === 'healthcare').length || 0 },
    { id: 'education', label: 'Education', count: polls?.filter(p => p?.category === 'education').length || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              Federal Polling Interface
            </h1>
            <p className="text-text-secondary">
              Participate in federal decision-making through transparent polling
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{polls?.length || 0}</div>
              <div className="text-sm text-text-secondary">Active Polls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {polls?.reduce((sum, poll) => sum + (poll?.total_votes || 0), 0)?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-text-secondary">Total Votes</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-md">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search polls by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-text-secondary">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="created_at">Date Created</option>
                <option value="total_votes">Most Voted</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <FilterChips
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error-600" />
            <span className="text-error-600">{error}</span>
          </div>
          <button 
            onClick={clearError}
            className="text-error-600 hover:text-error-700"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-text-secondary">Loading polls...</span>
          </div>
        </div>
      )}

      {/* Polls Grid */}
      {!isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPolls?.map((poll) => (
            <PollCard
              key={poll?.id}
              poll={poll}
              onVote={handleVote}
              hasVoted={hasUserVoted(poll?.id)}
              userVote={getUserVote(poll?.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPolls?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Vote" size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchTerm ? 'No polls found' : 'No polls available'}
          </h3>
          <p className="text-text-secondary">
            {searchTerm 
              ? 'Try adjusting your search terms or filters.' :'Check back later for new polling opportunities.'
            }
          </p>
        </div>
      )}

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="mt-8 p-6 bg-primary-50 border border-primary-100 rounded-xl text-center">
          <Icon name="Info" size={24} className="mx-auto text-primary-600 mb-3" />
          <h3 className="text-lg font-medium text-primary-700 mb-2">
            Sign in to participate
          </h3>
          <p className="text-primary-600 mb-4">
            Create an account or sign in to vote on federal polls and make your voice heard.
          </p>
          <a
            href="/login-screen"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Icon name="LogIn" size={16} className="mr-2" />
            Sign In
          </a>
        </div>
      )}
    </div>
  );
};

export default PollingInterface;