// src/pages/registration-screen/components/PrivacyModal.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-surface rounded-lg text-left overflow-hidden shadow-civic-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              Privacy Policy
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Voiced Platform Privacy Policy
              </h3>
              
              <p className="text-text-secondary mb-4">
                Your privacy is important to us. This policy explains how we collect, 
                use, and protect your personal information.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                1. Information We Collect
              </h4>
              <ul className="text-text-secondary mb-3 ml-4 list-disc">
                <li>Account information (name, email, ZIP code)</li>
                <li>Communication preferences and settings</li>
                <li>Platform usage and interaction data</li>
                <li>Poll responses and feedback submissions</li>
              </ul>

              <h4 className="font-semibold text-text-primary mb-2">
                2. How We Use Your Information
              </h4>
              <ul className="text-text-secondary mb-3 ml-4 list-disc">
                <li>Provide personalized government transparency tools</li>
                <li>Match you with relevant federal representatives</li>
                <li>Send notifications about polls and civic opportunities</li>
                <li>Generate anonymous analytics for transparency reports</li>
              </ul>

              <h4 className="font-semibold text-text-primary mb-2">
                3. Information Sharing
              </h4>
              <p className="text-text-secondary mb-3">
                We do not sell your personal information. We may share anonymized, 
                aggregated data for government transparency research and public reporting.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                4. Data Security
              </h4>
              <p className="text-text-secondary mb-3">
                We implement industry-standard security measures to protect your 
                personal information from unauthorized access, disclosure, or misuse.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                5. Your Rights
              </h4>
              <ul className="text-text-secondary mb-3 ml-4 list-disc">
                <li>Access and update your personal information</li>
                <li>Control your communication preferences</li>
                <li>Request data deletion (subject to legal requirements)</li>
                <li>Opt-out of non-essential data collection</li>
              </ul>

              <h4 className="font-semibold text-text-primary mb-2">
                6. Cookies and Tracking
              </h4>
              <p className="text-text-secondary mb-3">
                We use essential cookies for platform functionality and optional 
                analytics cookies to improve user experience. You can control 
                cookie preferences in your browser settings.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                7. Contact Us
              </h4>
              <p className="text-text-secondary mb-3">
                For privacy-related questions or requests, contact us at 
                privacy@voiced.gov or through our platform support channels.
              </p>

              <p className="text-text-muted text-sm mt-6">
                Last updated: December 2024
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-secondary-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;