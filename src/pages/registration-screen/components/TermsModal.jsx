// src/pages/registration-screen/components/TermsModal.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const TermsModal = ({ isOpen, onClose }) => {
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
              Terms of Service
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
                Voiced Platform Terms of Service
              </h3>
              
              <p className="text-text-secondary mb-4">
                By using the Voiced platform, you agree to the following terms and conditions:
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                1. Platform Purpose
              </h4>
              <p className="text-text-secondary mb-3">
                Voiced is a federal transparency platform designed to enhance citizen engagement 
                with government processes and promote democratic participation.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                2. User Responsibilities
              </h4>
              <ul className="text-text-secondary mb-3 ml-4 list-disc">
                <li>Provide accurate information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the platform in accordance with all applicable laws</li>
                <li>Respect the privacy and rights of other users</li>
              </ul>

              <h4 className="font-semibold text-text-primary mb-2">
                3. Data Usage
              </h4>
              <p className="text-text-secondary mb-3">
                Your participation data may be used to generate anonymous analytics 
                and transparency reports for government accountability purposes.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                4. Content Guidelines
              </h4>
              <p className="text-text-secondary mb-3">
                Users must maintain respectful discourse and avoid harmful, 
                misleading, or inappropriate content when engaging with platform features.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                5. Service Availability
              </h4>
              <p className="text-text-secondary mb-3">
                We strive to maintain platform availability but cannot guarantee 
                uninterrupted service due to maintenance, updates, or technical issues.
              </p>

              <h4 className="font-semibold text-text-primary mb-2">
                6. Account Termination
              </h4>
              <p className="text-text-secondary mb-3">
                Accounts may be suspended or terminated for violations of these terms 
                or misuse of platform features.
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

export default TermsModal;