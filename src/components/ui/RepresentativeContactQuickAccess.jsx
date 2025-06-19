import React, { useState } from 'react';
import Icon from '../AppIcon';

const RepresentativeContactQuickAccess = ({ 
  isOpen = false, 
  onClose = () => {}, 
  contentContext = null,
  className = '' 
}) => {
  const [selectedRep, setSelectedRep] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock representative data
  const representatives = [
    {
      id: 1,
      name: 'Senator Jane Smith',
      title: 'U.S. Senator',
      party: 'Democratic',
      state: 'CA',
      contact: 'senator.smith@senate.gov',
      phone: '(202) 224-3841'
    },
    {
      id: 2,
      name: 'Rep. John Doe',
      title: 'U.S. Representative',
      party: 'Republican',
      district: 'CA-12',
      contact: 'rep.doe@house.gov',
      phone: '(202) 225-5161'
    }
  ];

  const handleSendMessage = async () => {
    if (!selectedRep || !message.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Reset form and close
    setMessage('');
    setSelectedRep(null);
    onClose();
  };

  const getContextMessage = () => {
    if (!contentContext) return '';
    return `Regarding: ${contentContext.title || 'Recent content'}\n\n`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-200 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-civic-lg z-200 transform transition-transform duration-300 ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-heading font-semibold text-text-primary">
                Contact Representatives
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Send a message to your elected officials
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Representative Selection */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-text-primary">
                Select Representative
              </label>
              {representatives.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedRep(rep)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedRep?.id === rep.id
                      ? 'border-primary bg-primary-50' :'border-border hover:border-secondary-300 hover:bg-secondary-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">{rep.name}</h3>
                      <p className="text-sm text-text-secondary">{rep.title}</p>
                      <p className="text-xs text-text-muted">
                        {rep.party} • {rep.state || rep.district}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={16} className="text-text-muted" />
                      <Icon name="Mail" size={16} className="text-text-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Composition */}
            {selectedRep && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-text-primary">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`${getContextMessage()}Dear ${selectedRep.name},\n\nI am writing to express my views on...`}
                  className="w-full h-32 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                />
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{message.length} characters</span>
                  <span>Be respectful and specific</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-secondary-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!selectedRep || !message.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepresentativeContactQuickAccess;