import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const NotificationPreferences = ({ preferences: initialPreferences }) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const notificationOptions = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive updates and alerts via email',
      icon: 'Mail'
    },
    {
      key: 'pollReminders',
      title: 'Poll Reminders',
      description: 'Get notified about new federal polls',
      icon: 'BarChart3'
    },
    {
      key: 'newsAlerts',
      title: 'Breaking News Alerts',
      description: 'Instant notifications for breaking political news',
      icon: 'Bell'
    },
    {
      key: 'representativeUpdates',
      title: 'Representative Updates',
      description: 'Updates from your elected officials',
      icon: 'Users'
    }
  ];

  return (
    <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
            Notification Preferences
          </h3>
          <p className="text-text-secondary">
            Choose how you want to stay informed
          </p>
        </div>
        <Icon name="Settings" size={24} className="text-text-muted" />
      </div>

      <div className="space-y-6">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Icon name={option.icon} size={16} className="text-text-secondary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    {option.title}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {option.description}
                  </p>
                </div>
                
                <button
                  onClick={() => handleToggle(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    preferences[option.key] ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      preferences[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email Frequency Settings */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-4">
          Email Frequency
        </h4>
        <div className="space-y-3">
          {['immediate', 'daily', 'weekly'].map((frequency) => (
            <label key={frequency} className="flex items-center space-x-3">
              <input
                type="radio"
                name="emailFrequency"
                value={frequency}
                defaultChecked={frequency === 'daily'}
                className="h-4 w-4 text-primary focus:ring-primary border-border"
              />
              <span className="text-sm text-text-secondary capitalize">
                {frequency} digest
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          {saveSuccess && (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="Check" size={16} />
              <span className="text-sm">Preferences saved successfully</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="ml-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon name="Save" size={16} />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;