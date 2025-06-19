import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SuggestionForm from './components/SuggestionForm';
import SuggestionsFeed from './components/SuggestionsFeed';
import FilterControls from './components/FilterControls';
import RepresentativeContactQuickAccess from 'components/ui/RepresentativeContactQuickAccess';

const CommunityFeedbackHub = () => {
  const [activeSection, setActiveSection] = useState('vote');
  const [selectedFilter, setSelectedFilter] = useState('popularity');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [contactContext, setContactContext] = useState(null);

  const handleSendToRep = (suggestion) => {
    setContactContext({
      title: suggestion.title,
      type: 'Community Suggestion',
      content: suggestion.description
    });
    setIsContactPanelOpen(true);
  };

  const handleFormSubmit = () => {
    // Switch to voting section after successful submission
    setActiveSection('vote');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Community Feedback Hub
            </h1>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Shape the conversation by suggesting topics and voting on community priorities. 
              Your voice helps determine what issues deserve attention from our representatives.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Section Toggle */}
      <div className="lg:hidden bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex">
            <button
              onClick={() => setActiveSection('suggest')}
              className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${
                activeSection === 'suggest' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Plus" size={18} />
                <span>Suggest Topics</span>
              </div>
            </button>
            <button
              onClick={() => setActiveSection('vote')}
              className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${
                activeSection === 'vote' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Vote" size={18} />
                <span>Vote on Suggestions</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Desktop Left Panel / Mobile Conditional Section */}
          <div className={`lg:col-span-4 ${activeSection === 'suggest' ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon name="Plus" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-semibold text-text-primary">
                      Suggest Topics
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Propose new topics for community discussion
                    </p>
                  </div>
                </div>
                <SuggestionForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>

          {/* Desktop Right Panel / Mobile Conditional Section */}
          <div className={`lg:col-span-8 ${activeSection === 'vote' ? 'block' : 'hidden lg:block'} ${activeSection === 'suggest' ? 'mt-8 lg:mt-0' : ''}`}>
            <div className="space-y-6">
              {/* Filter Controls */}
              <FilterControls
                selectedFilter={selectedFilter}
                selectedCategory={selectedCategory}
                onFilterChange={setSelectedFilter}
                onCategoryChange={setSelectedCategory}
              />

              {/* Suggestions Feed */}
              <SuggestionsFeed
                filter={selectedFilter}
                category={selectedCategory}
                onSendToRep={handleSendToRep}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Representative Contact Panel */}
      <RepresentativeContactQuickAccess
        isOpen={isContactPanelOpen}
        onClose={() => setIsContactPanelOpen(false)}
        contentContext={contactContext}
      />
    </div>
  );
};

export default CommunityFeedbackHub;