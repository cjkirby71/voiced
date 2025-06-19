// src/pages/admin-dashboard/components/PollingAdministration.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const PollingAdministration = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    category: 'federal',
    scheduledDate: '',
    endDate: '',
    targetAudience: 'all'
  });

  // Mock polls data
  const polls = {
    active: [
      {
        id: 1,
        title: 'Federal Healthcare Reform Support',
        description: 'Do you support the proposed federal healthcare reforms?',
        category: 'Healthcare',
        responses: 8450,
        createdAt: '2024-01-15',
        endDate: '2024-01-25',
        status: 'active',
        forwardedToReps: 234
      },
      {
        id: 2,
        title: 'Infrastructure Investment Priority',
        description: 'Which infrastructure area should receive priority funding?',
        category: 'Infrastructure',
        responses: 6720,
        createdAt: '2024-01-18',
        endDate: '2024-01-28',
        status: 'active',
        forwardedToReps: 189
      }
    ],
    scheduled: [
      {
        id: 3,
        title: 'Climate Policy Preferences',
        description: 'What climate policies do you prioritize?',
        category: 'Environment',
        responses: 0,
        createdAt: '2024-01-20',
        scheduledDate: '2024-01-22',
        endDate: '2024-02-01',
        status: 'scheduled',
        forwardedToReps: 0
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Tax Reform Opinion',
        description: 'Do you support the proposed tax reforms?',
        category: 'Economy',
        responses: 15230,
        createdAt: '2024-01-01',
        endDate: '2024-01-15',
        status: 'completed',
        forwardedToReps: 456
      }
    ]
  };

  // Mock response analytics
  const responseAnalytics = [
    { name: 'Jan 15', responses: 1200 },
    { name: 'Jan 16', responses: 1800 },
    { name: 'Jan 17', responses: 2100 },
    { name: 'Jan 18', responses: 1650 },
    { name: 'Jan 19', responses: 2300 },
    { name: 'Jan 20', responses: 1900 }
  ];

  const tabs = [
    { id: 'active', label: 'Active Polls', count: polls?.active?.length },
    { id: 'scheduled', label: 'Scheduled', count: polls?.scheduled?.length },
    { id: 'completed', label: 'Completed', count: polls?.completed?.length }
  ];

  const handleCreatePoll = () => {
    console.log('Creating poll:', newPoll);
    setShowCreatePoll(false);
    setNewPoll({
      title: '',
      description: '',
      options: ['', ''],
      category: 'federal',
      scheduledDate: '',
      endDate: '',
      targetAudience: 'all'
    });
  };

  const handlePollAction = (poll, action) => {
    console.log(`Performing ${action} on poll:`, poll?.id);
  };

  const addPollOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev?.options, '']
    }));
  };

  const updatePollOption = (index, value) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev?.options?.map((option, i) => i === index ? value : option)
    }));
  };

  const removePollOption = (index) => {
    if (newPoll?.options?.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev?.options?.filter((_, i) => i !== index)
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success-50';
      case 'scheduled': return 'text-warning bg-warning-50';
      case 'completed': return 'text-text-secondary bg-secondary-100';
      default: return 'text-text-secondary bg-secondary-100';
    }
  };

  const renderPollsList = () => {
    const currentPolls = polls[activeTab] || [];
    
    return (
      <div className="space-y-4">
        {currentPolls?.map((poll) => (
          <div key={poll?.id} className="bg-surface border border-border rounded-lg p-6 shadow-civic">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  {poll?.title}
                </h4>
                <p className="text-text-secondary mb-3">{poll?.description}</p>
                <div className="flex items-center space-x-6 text-sm text-text-secondary">
                  <span className="flex items-center space-x-1">
                    <Icon name="Users" size={14} />
                    <span>{poll?.responses?.toLocaleString()} responses</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Send" size={14} />
                    <span>{poll?.forwardedToReps} forwarded to reps</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>Ends {poll?.endDate}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(poll?.status)}`}>
                  {poll?.status}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePollAction(poll, 'edit')}
                    className="p-2 text-text-secondary hover:text-primary transition-colors duration-200"
                    title="Edit Poll"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handlePollAction(poll, 'view')}
                    className="p-2 text-text-secondary hover:text-primary transition-colors duration-200"
                    title="View Analytics"
                  >
                    <Icon name="BarChart3" size={16} />
                  </button>
                  {poll?.status === 'active' && (
                    <button
                      onClick={() => handlePollAction(poll, 'end')}
                      className="p-2 text-text-secondary hover:text-error transition-colors duration-200"
                      title="End Poll"
                    >
                      <Icon name="Square" size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Poll Analytics Preview */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">{poll?.responses}</p>
                  <p className="text-sm text-text-secondary">Total Responses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">
                    {poll?.responses > 0 ? Math.round((poll?.forwardedToReps / poll?.responses) * 100) : 0}%
                  </p>
                  <p className="text-sm text-text-secondary">Forwarding Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">
                    {poll?.status === 'active' ? Math.ceil((new Date(poll?.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0}
                  </p>
                  <p className="text-sm text-text-secondary">Days Remaining</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-text-primary">Polling Administration</h2>
        <button
          onClick={() => setShowCreatePoll(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Icon name="Plus" size={16} />
          <span>Create Poll</span>
        </button>
      </div>

      {/* Response Analytics Chart */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Response Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={responseAnalytics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="responses" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
              }`}
            >
              <span>{tab?.label}</span>
              <span className="bg-secondary-200 text-text-secondary text-xs px-2 py-1 rounded-full">
                {tab?.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Polls List */}
      {renderPollsList()}

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-200 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-text-primary">Create New Poll</h3>
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Poll Title</label>
                <input
                  type="text"
                  value={newPoll?.title}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, title: e?.target?.value }))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  placeholder="Enter poll title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                <textarea
                  value={newPoll?.description}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, description: e?.target?.value }))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  rows={3}
                  placeholder="Enter poll description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Poll Options</label>
                <div className="space-y-2">
                  {newPoll?.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOption(index, e?.target?.value)}
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                        placeholder={`Option ${index + 1}`}
                      />
                      {newPoll?.options?.length > 2 && (
                        <button
                          onClick={() => removePollOption(index)}
                          className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors duration-200"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addPollOption}
                    className="flex items-center space-x-2 text-primary hover:text-primary-700 text-sm transition-colors duration-200"
                  >
                    <Icon name="Plus" size={16} />
                    <span>Add Option</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                  <select
                    value={newPoll?.category}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, category: e?.target?.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  >
                    <option value="federal">Federal</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="economy">Economy</option>
                    <option value="environment">Environment</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Target Audience</label>
                  <select
                    value={newPoll?.targetAudience}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, targetAudience: e?.target?.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  >
                    <option value="all">All Users</option>
                    <option value="premium">Premium Users</option>
                    <option value="state">By State</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Start Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newPoll?.scheduledDate}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, scheduledDate: e?.target?.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    value={newPoll?.endDate}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, endDate: e?.target?.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreatePoll(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollingAdministration;