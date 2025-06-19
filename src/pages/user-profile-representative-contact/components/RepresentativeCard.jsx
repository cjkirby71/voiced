import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RepresentativeCard = ({ representative, onContact }) => {
  const getPartyColor = (party) => {
    switch (party.toLowerCase()) {
      case 'democratic':
        return 'text-blue-600 bg-blue-50';
      case 'republican':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-text-secondary bg-secondary-100';
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-civic border border-border p-6 hover:shadow-civic-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <Image
          src={representative.image}
          alt={representative.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-heading font-semibold text-text-primary mb-1">
            {representative.name}
          </h3>
          <p className="text-text-secondary mb-2">{representative.title}</p>
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartyColor(representative.party)}`}>
              {representative.party}
            </span>
            <span className="text-sm text-text-muted">
              {representative.state || representative.district}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Building" size={16} className="text-text-muted mt-0.5" />
          <div className="text-sm">
            <p className="text-text-primary font-medium">{representative.office}</p>
            <p className="text-text-secondary">{representative.address}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="Phone" size={16} className="text-text-muted" />
          <a
            href={`tel:${representative.phone}`}
            className="text-sm text-primary hover:text-primary-700 transition-colors duration-200"
          >
            {representative.phone}
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="Mail" size={16} className="text-text-muted" />
          <a
            href={`mailto:${representative.email}`}
            className="text-sm text-primary hover:text-primary-700 transition-colors duration-200 truncate"
          >
            {representative.email}
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="Globe" size={16} className="text-text-muted" />
          <a
            href={representative.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary-700 transition-colors duration-200"
          >
            Official Website
          </a>
        </div>
      </div>

      {/* Additional Info */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Next Election:</span>
            <span className="ml-2 text-text-primary font-medium">
              {representative.nextElection}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Committees:</span>
            <div className="mt-1">
              {representative.committees.slice(0, 2).map((committee, index) => (
                <span
                  key={committee}
                  className="inline-block text-xs bg-secondary-100 text-text-secondary px-2 py-1 rounded mr-1 mb-1"
                >
                  {committee}
                </span>
              ))}
              {representative.committees.length > 2 && (
                <span className="text-xs text-text-muted">
                  +{representative.committees.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onContact}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Icon name="Send" size={16} />
          <span>Send Message</span>
        </button>
        <a
          href={`tel:${representative.phone}`}
          className="flex items-center justify-center px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors duration-200"
        >
          <Icon name="Phone" size={16} />
        </a>
        <a
          href={representative.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors duration-200"
        >
          <Icon name="ExternalLink" size={16} />
        </a>
      </div>
    </div>
  );
};

export default RepresentativeCard;