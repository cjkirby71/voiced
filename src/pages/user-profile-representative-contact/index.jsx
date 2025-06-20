// src/pages/user-profile-representative-contact/index.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import SubscriptionStatusIndicator from 'components/ui/SubscriptionStatusIndicator';
import RepresentativeContactQuickAccess from 'components/ui/RepresentativeContactQuickAccess';
import { useAuth } from 'context/AuthContext';
import ProfileSettings from './components/ProfileSettings';
import RepresentativeCard from './components/RepresentativeCard';
import CommunicationHistory from './components/CommunicationHistory';
import NotificationPreferences from './components/NotificationPreferences';

const UserProfileRepresentativeContact = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  
  // Get user data from AuthContext
  const { user, userProfile, loading, authError } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Loading Profile</h2>
          <p className="text-text-secondary">Please wait while we load your information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertCircle" size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Profile Load Error</h2>
            <p className="text-text-secondary mb-6">{authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Authentication Required</h2>
            <p className="text-text-secondary mb-6">Please sign in to view your profile and representative information.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/login-screen'}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/registration-screen'}
                className="px-4 py-2 border border-gray-300 text-text-primary rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare user data from auth context
  const userData = {
    name: userProfile?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || 'No email provided',
    location: userProfile?.zip_code ? `ZIP ${userProfile.zip_code}` : 'Location not set',
    district: 'N/A', // This would come from location-based lookup
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown',
    subscriptionTier: userProfile?.tier || 'free',
    avatar: user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'U')}&background=6366f1&color=fff`,
    bio: userProfile?.bio || `Welcome to Voiced! I'm engaged in civic activities and committed to staying informed about legislation that impacts our community.`,
    preferences: {
      emailNotifications: userProfile?.email_notifications !== false,
      pollReminders: true,
      newsAlerts: false,
      representativeUpdates: true,
      smsNotifications: userProfile?.sms_notifications || false
    }
  };

  // Mock representative data (in real app, this would be fetched based on user location)
  const representatives = [
    {
      id: 1,
      name: 'Senator Example',
      title: 'U.S. Senator',
      party: 'Independent',
      state: 'Your State',
      office: 'Senate Office Building, Room 123',
      address: 'Washington, DC 20510',
      phone: '(202) 224-0000',
      email: 'senator@example.senate.gov',
      website: 'https://example.senate.gov',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      nextElection: '2026',
      committees: ['Judiciary', 'Finance']
    },
    {
      id: 2,
      name: 'Rep. Example',
      title: 'U.S. Representative',
      party: 'Independent',
      district: 'Your District',
      office: 'House Office Building, Room 456',
      address: 'Washington, DC 20515',
      phone: '(202) 225-0000',
      email: 'rep.example@mail.house.gov',
      website: 'https://example.house.gov',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face',
      nextElection: '2024',
      committees: ['House Leadership', 'Budget']
    }
  ];

  // Mock communication history
  const communicationHistory = [
    {
      id: 1,
      type: 'poll_response',
      title: 'Federal Infrastructure Bill Support',
      date: new Date().toLocaleDateString(),
      response: 'Yes',
      representative: 'Senator Example',
      status: 'sent'
    },
    {
      id: 2,
      type: 'message',
      title: 'Healthcare Reform Concerns',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      content: 'Regarding the proposed healthcare legislation...',
      representative: 'Rep. Example',
      status: 'delivered'
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'representatives', label: 'Representatives', icon: 'Users' },
    { id: 'history', label: 'Communication', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleContactRepresentative = (representative) => {
    setSelectedRepresentative(representative);
    setIsContactPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                Profile & Representatives
              </h1>
              <p className="text-text-secondary">
                Manage your account and connect with your elected officials
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <SubscriptionStatusIndicator tier={userData.subscriptionTier} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Information Card */}
              <div className="lg:col-span-2">
                <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={userData.avatar}
                        alt={userData.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-heading font-semibold text-text-primary">
                          {userData.name}
                        </h2>
                        <button className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200">
                          Edit Profile
                        </button>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-text-secondary">
                          <Icon name="Mail" size={16} />
                          <span>{userData.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-text-secondary">
                          <Icon name="MapPin" size={16} />
                          <span>{userData.location} • District {userData.district}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-text-secondary">
                          <Icon name="Calendar" size={16} />
                          <span>Member since {userData.joinDate}</span>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {userData.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                    Activity Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Polls Participated</span>
                      <span className="font-semibold text-text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Messages Sent</span>
                      <span className="font-semibold text-text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Articles Shared</span>
                      <span className="font-semibold text-text-primary">0</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                    Subscription Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Current Plan</span>
                      <SubscriptionStatusIndicator tier={userData.subscriptionTier} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Account Status</span>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Representatives Tab */}
          {activeTab === 'representatives' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {representatives.map((representative) => (
                <RepresentativeCard
                  key={representative.id}
                  representative={representative}
                  onContact={() => handleContactRepresentative(representative)}
                />
              ))}
            </div>
          )}

          {/* Communication History Tab */}
          {activeTab === 'history' && (
            <CommunicationHistory history={communicationHistory} />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NotificationPreferences preferences={userData.preferences} />
              <ProfileSettings userData={userData} />
            </div>
          )}
        </div>
      </div>

      {/* Representative Contact Panel */}
      <RepresentativeContactQuickAccess
        isOpen={isContactPanelOpen}
        onClose={() => setIsContactPanelOpen(false)}
        contentContext={selectedRepresentative ? {
          title: `Contact ${selectedRepresentative.name}`,
          type: 'representative'
        } : null}
      />
    </div>
  );
};

export default UserProfileRepresentativeContact;