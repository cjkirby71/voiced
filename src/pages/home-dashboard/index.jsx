import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

import SubscriptionStatusIndicator from 'components/ui/SubscriptionStatusIndicator';
import RepresentativeContactQuickAccess from 'components/ui/RepresentativeContactQuickAccess';
import MultimediaTeaser from './components/MultimediaTeaser';
import RecentPolls from './components/RecentPolls';
import TrendingNews from './components/TrendingNews';
import QuickActions from './components/QuickActions';

const HomeDashboard = () => {
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userTier, setUserTier] = useState('Free'); // Mock user tier

  // Mock user stats
  const userStats = {
    pollsParticipated: 12,
    articlesRead: 8,
    feedbackSubmitted: 3,
    daysActive: 15
  };

  // Pull to refresh functionality
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Touch event handlers for pull-to-refresh
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let pulling = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pulling) return;
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 100 && !refreshing) {
        handleRefresh();
        pulling = false;
      }
    };

    const handleTouchEnd = () => {
      pulling = false;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshing]);

  return (
    <div className="min-h-screen bg-background">
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-primary text-white text-center py-2 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="RefreshCw" size={16} className="animate-spin" />
            <span>Refreshing content...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-text-primary mb-2">
                Welcome to Voiced
              </h1>
              <p className="text-text-secondary">
                Your voice in government transparency and accountability
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <SubscriptionStatusIndicator tier={userTier} />
              <button
                onClick={() => setIsContactPanelOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-700 transition-colors duration-200"
              >
                <Icon name="MessageSquare" size={16} />
                <span className="hidden sm:inline">Contact Rep</span>
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{userStats.pollsParticipated}</p>
                  <p className="text-xs text-text-secondary">Polls Participated</p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon name="Newspaper" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{userStats.articlesRead}</p>
                  <p className="text-xs text-text-secondary">Articles Read</p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{userStats.feedbackSubmitted}</p>
                  <p className="text-xs text-text-secondary">Feedback Sent</p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{userStats.daysActive}</p>
                  <p className="text-xs text-text-secondary">Days Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multimedia Teaser Banner */}
        <MultimediaTeaser />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Polls Section */}
          <RecentPolls userTier={userTier} />

          {/* Trending News Section */}
          <TrendingNews userTier={userTier} />
        </div>

        {/* Quick Actions */}
        <QuickActions userTier={userTier} />

        {/* Navigation Breadcrumbs */}
        <div className="mt-12 pt-6 border-t border-border">
          <nav className="flex items-center space-x-2 text-sm text-text-muted">
            <Icon name="Home" size={16} />
            <span>Home Dashboard</span>
            <Icon name="ChevronRight" size={14} />
            <span className="text-text-secondary">Federal Transparency Platform</span>
          </nav>
        </div>
      </div>

      {/* Representative Contact Panel */}
      <RepresentativeContactQuickAccess
        isOpen={isContactPanelOpen}
        onClose={() => setIsContactPanelOpen(false)}
      />

      {/* Mobile Sticky Footer - Quick Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-40">
        <div className="flex space-x-3">
          <Link
            to="/subscription-management"
            className="flex-1 text-center py-3 border border-border rounded-lg text-text-secondary hover:bg-secondary-50 transition-colors duration-200"
          >
            Join Free
          </Link>
          <Link
            to="/subscription-management"
            className="flex-1 text-center py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            $5 Full Access
          </Link>
        </div>
      </div>

      {/* Bottom padding for mobile sticky footer */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default HomeDashboard;