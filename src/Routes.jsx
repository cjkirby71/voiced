// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import GlobalSearchFilter from "components/ui/GlobalSearchFilter";
import HomeDashboard from "pages/home-dashboard";
import PollingInterface from "pages/polling-interface";
import SubscriptionManagement from "pages/subscription-management";
import UserProfileRepresentativeContact from "pages/user-profile-representative-contact";
import CommunityFeedbackHub from "pages/community-feedback-hub";
import JournalismHub from "pages/journalism-hub";
import LoginScreen from "pages/login-screen";
import RegistrationScreen from "pages/registration-screen";
import AdminDashboard from "pages/admin-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-background">
          <Header />
          <GlobalSearchFilter />
          <main className="pt-16">
            <RouterRoutes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/home-dashboard" element={<HomeDashboard />} />
              <Route path="/polling-interface" element={<PollingInterface />} />
              <Route path="/subscription-management" element={<SubscriptionManagement />} />
              <Route path="/user-profile-representative-contact" element={<UserProfileRepresentativeContact />} />
              <Route path="/community-feedback-hub" element={<CommunityFeedbackHub />} />
              <Route path="/journalism-hub" element={<JournalismHub />} />
              <Route path="/login-screen" element={<LoginScreen />} />
              <Route path="/registration-screen" element={<RegistrationScreen />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;