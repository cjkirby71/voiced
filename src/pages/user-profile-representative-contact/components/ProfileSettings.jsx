import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ProfileSettings = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    location: userData.location,
    bio: userData.bio
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      location: userData.location,
      bio: userData.bio
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-surface rounded-lg shadow-civic border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
            Profile Settings
          </h3>
          <p className="text-text-secondary">
            Update your personal information
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200"
          >
            Edit Profile
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-success-50 border border-success-100 rounded-lg">
          <div className="flex items-center space-x-2 text-success">
            <Icon name="CheckCircle" size={20} />
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <p className="text-text-secondary">{formData.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <p className="text-text-secondary">{formData.email}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <p className="text-text-secondary">{formData.location}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Tell us about yourself and your civic interests..."
            />
          ) : (
            <p className="text-text-secondary text-sm leading-relaxed">{formData.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-3 pt-4 border-t border-border">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-4">
          Account Actions
        </h4>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200 flex items-center space-x-3">
            <Icon name="Key" size={16} className="text-text-muted" />
            <span className="text-sm text-text-secondary">Change Password</span>
          </button>
          <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-secondary-50 transition-colors duration-200 flex items-center space-x-3">
            <Icon name="Download" size={16} className="text-text-muted" />
            <span className="text-sm text-text-secondary">Export Data</span>
          </button>
          <button className="w-full text-left px-4 py-3 border border-error-200 text-error rounded-lg hover:bg-error-50 transition-colors duration-200 flex items-center space-x-3">
            <Icon name="Trash2" size={16} className="text-error" />
            <span className="text-sm">Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;