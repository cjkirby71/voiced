// src/pages/admin-dashboard/components/SystemSettings.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SystemSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Voiced',
    siteDescription: 'Your Voice in Government Transparency and Accountability',
    maintenanceMode: false,
    debugMode: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    
    // API Settings
    apiRateLimit: 100,
    apiTimeout: 30,
    apiCaching: true,
    webhookEnabled: true,
    
    // Feature Toggles
    pollingFeature: true,
    journalismHub: true,
    communityFeedback: true,
    representativeContact: true,
    subscriptionTiers: true,
    biasDetection: true,
    
    // Content Settings
    autoModeration: true,
    biasThreshold: 70,
    contentRetention: 365,
    maxArticleLength: 10000,
    
    // Security Settings
    twoFactorAuth: true,
    passwordComplexity: true,
    sessionTimeout: 60,
    ipWhitelist: false
  });
  
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const sections = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'api', label: 'API & Integrations', icon: 'Zap' },
    { id: 'features', label: 'Feature Toggles', icon: 'ToggleLeft' },
    { id: 'content', label: 'Content Settings', icon: 'FileText' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setUnsavedChanges(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Site Name</label>
          <input
            type="text"
            value={settings?.siteName}
            onChange={(e) => handleSettingChange('siteName', e?.target?.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Site Description</label>
          <input
            type="text"
            value={settings?.siteDescription}
            onChange={(e) => handleSettingChange('siteDescription', e?.target?.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <h4 className="font-medium text-text-primary">Maintenance Mode</h4>
            <p className="text-sm text-text-secondary">Temporarily disable access to the platform</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e?.target?.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <h4 className="font-medium text-text-primary">Debug Mode</h4>
            <p className="text-sm text-text-secondary">Enable detailed logging for troubleshooting</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.debugMode}
              onChange={(e) => handleSettingChange('debugMode', e?.target?.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {[
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Send notifications via email' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Text message notifications' },
        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Send weekly analytics reports' }
      ]?.map((item) => (
        <div key={item?.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <h4 className="font-medium text-text-primary">{item?.label}</h4>
            <p className="text-sm text-text-secondary">{item?.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[item?.key]}
              onChange={(e) => handleSettingChange(item?.key, e?.target?.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">API Rate Limit (requests/minute)</label>
          <input
            type="number"
            value={settings?.apiRateLimit}
            onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">API Timeout (seconds)</label>
          <input
            type="number"
            value={settings?.apiTimeout}
            onChange={(e) => handleSettingChange('apiTimeout', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'apiCaching', label: 'API Caching', description: 'Enable response caching for better performance' },
          { key: 'webhookEnabled', label: 'Webhook Support', description: 'Allow external webhook integrations' }
        ]?.map((item) => (
          <div key={item?.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">{item?.label}</h4>
              <p className="text-sm text-text-secondary">{item?.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item?.key]}
                onChange={(e) => handleSettingChange(item?.key, e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeatureToggles = () => (
    <div className="space-y-4">
      {[
        { key: 'pollingFeature', label: 'Polling System', description: 'Enable federal polling functionality' },
        { key: 'journalismHub', label: 'Journalism Hub', description: 'Enable news and article features' },
        { key: 'communityFeedback', label: 'Community Feedback', description: 'Enable community suggestions and feedback' },
        { key: 'representativeContact', label: 'Representative Contact', description: 'Enable direct representative communication' },
        { key: 'subscriptionTiers', label: 'Subscription System', description: 'Enable paid subscription tiers' },
        { key: 'biasDetection', label: 'Bias Detection', description: 'Enable automated content bias detection' }
      ]?.map((item) => (
        <div key={item?.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div>
            <h4 className="font-medium text-text-primary">{item?.label}</h4>
            <p className="text-sm text-text-secondary">{item?.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[item?.key]}
              onChange={(e) => handleSettingChange(item?.key, e?.target?.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Bias Detection Threshold (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings?.biasThreshold}
            onChange={(e) => handleSettingChange('biasThreshold', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Content Retention (days)</label>
          <input
            type="number"
            value={settings?.contentRetention}
            onChange={(e) => handleSettingChange('contentRetention', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Max Article Length (characters)</label>
          <input
            type="number"
            value={settings?.maxArticleLength}
            onChange={(e) => handleSettingChange('maxArticleLength', parseInt(e?.target?.value))}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
        <div>
          <h4 className="font-medium text-text-primary">Auto Moderation</h4>
          <p className="text-sm text-text-secondary">Automatically flag content based on bias detection</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings?.autoModeration}
            onChange={(e) => handleSettingChange('autoModeration', e?.target?.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Session Timeout (minutes)</label>
        <input
          type="number"
          value={settings?.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e?.target?.value))}
          className="w-full md:w-1/2 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
        />
      </div>
      
      <div className="space-y-4">
        {[
          { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Require 2FA for admin accounts' },
          { key: 'passwordComplexity', label: 'Password Complexity', description: 'Enforce strong password requirements' },
          { key: 'ipWhitelist', label: 'IP Whitelist', description: 'Restrict admin access to specific IP addresses' }
        ]?.map((item) => (
          <div key={item?.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">{item?.label}</h4>
              <p className="text-sm text-text-secondary">{item?.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item?.key]}
                onChange={(e) => handleSettingChange(item?.key, e?.target?.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'api': return renderAPISettings();
      case 'features': return renderFeatureToggles();
      case 'content': return renderContentSettings();
      case 'security': return renderSecuritySettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Alert */}
      {unsavedChanges && (
        <div className="bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm">You have unsaved changes</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setUnsavedChanges(false)}
              className="text-sm text-warning-600 hover:text-warning-700 transition-colors duration-200"
            >
              Discard
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-3 py-1 bg-warning text-white text-sm rounded-lg hover:bg-warning-600 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Section Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex space-x-8 min-w-max">
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeSection === section?.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
              }`}
            >
              <Icon name={section?.icon} size={16} />
              <span>{section?.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
          {sections?.find(s => s?.id === activeSection)?.label} Settings
        </h3>
        {renderSectionContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleResetSettings}
          className="flex items-center space-x-2 px-4 py-2 text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
        >
          <Icon name="RotateCcw" size={16} />
          <span>Reset to Defaults</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Export settings')}
            className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <Icon name="Download" size={16} />
            <span>Export Settings</span>
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={!unsavedChanges}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
              unsavedChanges
                ? 'bg-primary text-white hover:bg-primary-700' :'bg-secondary-200 text-text-secondary cursor-not-allowed'
            }`}
          >
            <Icon name="Save" size={16} />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;