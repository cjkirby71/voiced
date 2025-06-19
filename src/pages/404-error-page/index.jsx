// src/pages/404-error-page/index.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from 'components/AppIcon';

import ErrorIllustration from './components/ErrorIllustration';
import SearchWidget from './components/SearchWidget';
import NavigationActions from './components/NavigationActions';
import RecentActivityLinks from './components/RecentActivityLinks';

const NotFoundErrorPage = () => {
  // Track 404 page visits for analytics
  useEffect(() => {
    // In a real app, you might want to log this to analytics
    console.log('404 page visited:', window.location.pathname);
  }, []);

  return (
    <>
      <Helmet>
        <title>Page Not Found - Voiced | Government Transparency Platform</title>
        <meta name="description" content="The page you're looking for doesn't exist. Find what you need through Voiced's government transparency tools and civic engagement features." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header with Voiced Branding */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link to="/home-dashboard" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Megaphone" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-bold text-text-primary group-hover:text-primary transition-colors duration-200">
                    Voiced
                  </h1>
                  <p className="text-xs text-text-muted">
                    Government Transparency Platform
                  </p>
                </div>
              </Link>
              
              <Link
                to="/home-dashboard"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <Icon name="Home" size={16} />
                <span className="text-sm">Return Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            {/* Error Illustration */}
            <ErrorIllustration />
            
            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-6xl sm:text-7xl font-heading font-bold text-primary mb-4">
                404
              </h1>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-text-primary mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                We couldn't find the government resource or civic engagement tool you're looking for. 
                This page may have been moved, removed, or the link might be incorrect.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Search and Navigation */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Find What You Need
                </h3>
                <SearchWidget />
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Quick Access
                </h3>
                <NavigationActions />
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Continue Where You Left Off
                </h3>
                <RecentActivityLinks />
              </div>
              
              {/* Help Section */}
              <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Info" size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">
                      Need Assistance?
                    </h4>
                    <p className="text-sm text-text-secondary mb-3">
                      Our platform provides tools for government transparency and civic engagement. 
                      If you're having trouble finding specific content, try our search feature or visit our main sections.
                    </p>
                    <Link
                      to="/community-feedback-hub"
                      className="inline-flex items-center space-x-1 text-sm text-primary hover:text-primary-700 transition-colors duration-200"
                    >
                      <span>Contact Support</span>
                      <Icon name="ExternalLink" size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Features */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Explore Voiced's Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Live Polling',
                  description: 'Participate in government policy polls',
                  path: '/polling-interface',
                  icon: 'BarChart3',
                  color: 'primary'
                },
                {
                  title: 'News Analysis',
                  description: 'Access independent journalism',
                  path: '/journalism-hub',
                  icon: 'Newspaper',
                  color: 'success'
                },
                {
                  title: 'Civic Feedback',
                  description: 'Share your voice on policy matters',
                  path: '/community-feedback-hub',
                  icon: 'MessageCircle',
                  color: 'warning'
                }
              ].map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  className={`p-4 border border-border rounded-lg hover:border-secondary-300 hover:bg-secondary-50 transition-all duration-200 group`}
                >
                  <div className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${feature.color}-200 transition-colors duration-200`}>
                    <Icon name={feature.icon} size={20} className={`text-${feature.color}`} />
                  </div>
                  <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors duration-200 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-text-muted">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-text-muted mb-4 sm:mb-0">
                <Icon name="Shield" size={16} />
                <span>Secure Government Transparency Platform</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-text-muted">
                <Link to="/home-dashboard" className="hover:text-text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="/home-dashboard" className="hover:text-text-primary transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link to="/community-feedback-hub" className="hover:text-text-primary transition-colors duration-200">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Padding */}
        <div className="h-6"></div>
      </div>
    </>
  );
};

export default NotFoundErrorPage;