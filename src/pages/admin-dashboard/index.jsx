// src/pages/admin-dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

import UserManagement from './components/UserManagement';
import ContentModeration from './components/ContentModeration';
import PollingAdministration from './components/PollingAdministration';
import SubscriptionAnalytics from './components/SubscriptionAnalytics';
import SystemSettings from './components/SystemSettings';
import DashboardMetrics from './components/DashboardMetrics';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminRole, setAdminRole] = useState('system_admin'); // system_admin, content_moderator, user_admin
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    pollParticipation: 0,
    subscriptionConversions: 0,
    contentEngagement: 0
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics({
        activeUsers: Math.floor(Math.random() * 10000) + 5000,
        pollParticipation: Math.floor(Math.random() * 100),
        subscriptionConversions: Math.floor(Math.random() * 50) + 10,
        contentEngagement: Math.floor(Math.random() * 100)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: 'BarChart3', 
      roles: ['system_admin', 'content_moderator', 'user_admin'] 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: 'Users', 
      roles: ['system_admin', 'user_admin'] 
    },
    { 
      id: 'content', 
      label: 'Content Moderation', 
      icon: 'Shield', 
      roles: ['system_admin', 'content_moderator'] 
    },
    { 
      id: 'polling', 
      label: 'Polling Admin', 
      icon: 'Vote', 
      roles: ['system_admin'] 
    },
    { 
      id: 'analytics', 
      label: 'Subscription Analytics', 
      icon: 'TrendingUp', 
      roles: ['system_admin'] 
    },
    { 
      id: 'settings', 
      label: 'System Settings', 
      icon: 'Settings', 
      roles: ['system_admin'] 
    }
  ];

  const filteredSidebarItems = sidebarItems.filter(item => 
    item?.roles?.includes(adminRole)
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardMetrics metrics={realTimeMetrics} />;
      case 'users':
        return <UserManagement adminRole={adminRole} />;
      case 'content':
        return <ContentModeration adminRole={adminRole} />;
      case 'polling':
        return <PollingAdministration />;
      case 'analytics':
        return <SubscriptionAnalytics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardMetrics metrics={realTimeMetrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-surface border-r border-border transition-all duration-300 ease-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-heading font-bold text-text-primary">Admin Panel</h2>
                <p className="text-xs text-text-secondary capitalize">{adminRole?.replace('_', ' ')}</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredSidebarItems?.map((item) => (
            <button
              key={item?.id}
              onClick={() => setActiveSection(item?.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
                activeSection === item?.id
                  ? 'bg-primary text-white shadow-civic'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }`}
              title={sidebarCollapsed ? item?.label : ''}
            >
              <Icon name={item?.icon} size={20} />
              {!sidebarCollapsed && <span>{item?.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Link
            to="/home-dashboard"
            className="flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            title={sidebarCollapsed ? 'Back to Main Site' : ''}
          >
            <Icon name="ArrowLeft" size={20} />
            {!sidebarCollapsed && <span className="text-sm">Back to Main Site</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-text-primary">
                {filteredSidebarItems?.find(item => item?.id === activeSection)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-text-secondary mt-1">
                Comprehensive platform oversight and control
              </p>
            </div>
            
            {/* Real-time Metrics Bar */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">Live Data</span>
              </div>
              <div className="text-sm">
                <span className="text-text-secondary">Active Users: </span>
                <span className="font-bold text-text-primary">{realTimeMetrics?.activeUsers?.toLocaleString()}</span>
              </div>
              <div className="text-sm">
                <span className="text-text-secondary">Poll Participation: </span>
                <span className="font-bold text-text-primary">{realTimeMetrics?.pollParticipation}%</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;