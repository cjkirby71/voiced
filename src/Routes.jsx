// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import RouteTransition from "components/RouteTransition";
import Header from "components/ui/Header";
import GlobalSearchFilter from "components/ui/GlobalSearchFilter";
import AuthenticationCallbackHandler from "pages/authentication-callback-handler";
import { useGoogleAnalytics } from 'hooks/useGoogleAnalytics';
import HomeDashboard from "pages/home-dashboard";
import PollingInterface from "pages/polling-interface";
import SubscriptionManagement from "pages/subscription-management";
import UserProfileRepresentativeContact from "pages/user-profile-representative-contact";
import CommunityFeedbackHub from "pages/community-feedback-hub";
import JournalismHub from "pages/journalism-hub";
import LoginScreen from "pages/login-screen";
import RegistrationScreen from "pages/registration-screen";
import AdminDashboard from "pages/admin-dashboard";
import AuthenticationSetupGuide from "pages/authentication-setup-guide";
import DeveloperAuthenticationGuide from "pages/developer-authentication-guide";

import NotFoundErrorPage from "pages/404-error-page";

// Root Layout Component
const RootLayout = () => {
  // Initialize Google Analytics
  useGoogleAnalytics();

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <Header />
        <GlobalSearchFilter />
        <main className="pt-16">
          <RouteTransition>
            <Outlet />
          </RouteTransition>
        </main>
      </div>
    </ErrorBoundary>
  );
};

// Error Boundary for Route-specific errors
const RouteErrorBoundary = ({ error }) => {
  console.error('Route Error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Something went wrong</h1>
        <p className="text-text-secondary mb-6">We're sorry, but something unexpected happened.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Home component that handles auth callbacks when query params are present
const HomeWithAuthCallback = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hasAuthParams = searchParams.has('code') || searchParams.has('error') || searchParams.has('error_description');
  
  // If URL has auth-related query parameters, show auth callback handler
  if (hasAuthParams) {
    return <AuthenticationCallbackHandler />;
  }
  
  // Otherwise show normal home dashboard
  return <HomeDashboard />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main application routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomeWithAuthCallback />} />
          <Route path="home-dashboard" element={<HomeDashboard />} />
          <Route path="polling-interface" element={<PollingInterface />} />
          <Route path="subscription-management" element={<SubscriptionManagement />} />
          <Route path="user-profile-representative-contact" element={<UserProfileRepresentativeContact />} />
          <Route path="community-feedback-hub" element={<CommunityFeedbackHub />} />
          <Route path="journalism-hub" element={<JournalismHub />} />
          <Route path="login-screen" element={<LoginScreen />} />
          <Route path="registration-screen" element={<RegistrationScreen />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="authentication-setup-guide" element={<AuthenticationSetupGuide />} />
          <Route path="authentication-callback-handler" element={<AuthenticationCallbackHandler />} />
          <Route path="developer-authentication-guide" element={<DeveloperAuthenticationGuide />} />
          
          {/* Dedicated auth callback routes */}
          <Route path="/auth/callback" element={<AuthenticationCallbackHandler />} />
          <Route path="auth/confirm" element={<AuthenticationCallbackHandler />} />
          
          {/* New dedicated 404 error page route */}
          <Route path="404-error-page" element={<NotFoundErrorPage />} />
        </Route>
        
        {/* Catch-all route uses the enhanced 404 page */}
        <Route path="*" element={<NotFoundErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;