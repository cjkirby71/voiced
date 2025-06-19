import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

import LegacyMediaSection from './components/LegacyMediaSection';
import IndependentMediaSection from './components/IndependentMediaSection';
import RepresentativeContactQuickAccess from 'components/ui/RepresentativeContactQuickAccess';

const JournalismHub = () => {
  const [activeSection, setActiveSection] = useState('legacy');
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleSendToRep = (article) => {
    setSelectedArticle(article);
    setIsContactPanelOpen(true);
  };

  const sections = [
    {
      id: 'legacy',
      label: 'Legacy Media',
      icon: 'Building2',
      description: 'Major news outlets with RSS integration'
    },
    {
      id: 'independent',
      label: 'Independent Media',
      icon: 'Users',
      description: 'Independent journalists and publications'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Newspaper" size={24} color="white" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Journalism Hub
              </h1>
            </div>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Bias-aware news consumption through transparent reporting and independent journalism support
            </p>
          </div>
        </div>
      </div>

      {/* Section Toggle Tabs - Sticky */}
      <div className="sticky top-16 z-50 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-primary text-white shadow-civic'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                }`}
              >
                <Icon name={section.icon} size={18} />
                <div className="text-left">
                  <div className="font-medium">{section.label}</div>
                  <div className="text-xs opacity-80 hidden sm:block">
                    {section.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'legacy' && (
          <LegacyMediaSection onSendToRep={handleSendToRep} />
        )}
        {activeSection === 'independent' && (
          <IndependentMediaSection onSendToRep={handleSendToRep} />
        )}
      </div>

      {/* Representative Contact Panel */}
      <RepresentativeContactQuickAccess
        isOpen={isContactPanelOpen}
        onClose={() => setIsContactPanelOpen(false)}
        contentContext={selectedArticle}
      />
    </div>
  );
};

export default JournalismHub;