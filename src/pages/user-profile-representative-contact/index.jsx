import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import SubscriptionStatusIndicator from 'components/ui/SubscriptionStatusIndicator';
import RepresentativeContactQuickAccess from 'components/ui/RepresentativeContactQuickAccess';
import ProfileSettings from './components/ProfileSettings';
import RepresentativeCard from './components/RepresentativeCard';
import CommunicationHistory from './components/CommunicationHistory';
import NotificationPreferences from './components/NotificationPreferences';

const UserProfileRepresentativeContact = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);

  // Mock user data
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    location: 'San Francisco, CA',
    district: 'CA-12',
    joinDate: '03/15/2024',
    subscriptionTier: 'National',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: `Passionate about civic engagement and government transparency. I believe in the power of informed citizens to drive positive change in our democracy. Active in local community organizations and committed to staying informed about federal legislation that impacts our daily lives.`,
    preferences: {
      emailNotifications: true,
      pollReminders: true,
      newsAlerts: false,
      representativeUpdates: true
    }
  };

  // Mock representative data
  const representatives = [
    {
      id: 1,
      name: 'Senator Dianne Feinstein',
      title: 'U.S. Senator',
      party: 'Democratic',
      state: 'California',
      office: 'Hart Senate Office Building, Room 331',
      address: 'Washington, DC 20510',
      phone: '(202) 224-3841',
      email: 'senator@feinstein.senate.gov',
      website: 'https://www.feinstein.senate.gov',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      nextElection: '2024',
      committees: ['Judiciary', 'Intelligence', 'Appropriations']
    },
    {
      id: 2,
      name: 'Rep. Nancy Pelosi',
      title: 'U.S. Representative',
      party: 'Democratic',
      district: 'CA-12',
      office: 'Rayburn House Office Building, Room 2371',
      address: 'Washington, DC 20515',
      phone: '(202) 225-5161',
      email: 'rep.pelosi@mail.house.gov',
      website: 'https://pelosi.house.gov',
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
      date: '12/08/2024',
      response: 'Yes',
      representative: 'Senator Dianne Feinstein',
      status: 'sent'
    },
    {
      id: 2,
      type: 'message',
      title: 'Healthcare Reform Concerns',
      date: '12/05/2024',
      content: 'Regarding the proposed healthcare legislation...',
      representative: 'Rep. Nancy Pelosi',
      status: 'delivered'
    },
    {
      id: 3,
      type: 'poll_response',
      title: 'Climate Change Action Plan',
      date: '12/01/2024',
      response: 'Yes',
      representative: 'Both Representatives',
      status: 'sent'
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
                      <span className="font-semibold text-text-primary">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Messages Sent</span>
                      <span className="font-semibold text-text-primary">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Articles Shared</span>
                      <span className="font-semibold text-text-primary">12</span>
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
                      <span className="text-text-secondary">Next Billing</span>
                      <span className="text-sm text-text-primary">01/15/2025</span>
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