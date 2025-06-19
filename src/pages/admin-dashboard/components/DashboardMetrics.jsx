// src/pages/admin-dashboard/components/DashboardMetrics.jsx
import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from 'components/AppIcon';

const DashboardMetrics = ({ metrics }) => {
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data for charts
  const userActivityData = [
    { name: '00:00', users: 2400, polls: 240 },
    { name: '04:00', users: 1398, polls: 139 },
    { name: '08:00', users: 9800, polls: 980 },
    { name: '12:00', users: 3908, polls: 390 },
    { name: '16:00', users: 4800, polls: 480 },
    { name: '20:00', users: 3800, polls: 380 }
  ];

  const subscriptionData = [
    { name: 'Free', value: 65, count: 6500 },
    { name: 'Premium', value: 25, count: 2500 },
    { name: 'Pro', value: 10, count: 1000 }
  ];

  const COLORS = ['#64748B', '#2563EB', '#DC2626'];

  const metricCards = [
    {
      title: 'Active Users',
      value: metrics?.activeUsers || 0,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'bg-primary-100 text-primary'
    },
    {
      title: 'Poll Participation',
      value: `${metrics?.pollParticipation || 0}%`,
      change: '+8.2%',
      changeType: 'positive',
      icon: 'BarChart3',
      color: 'bg-success-100 text-success'
    },
    {
      title: 'Subscription Conversions',
      value: metrics?.subscriptionConversions || 0,
      change: '+15.3%',
      changeType: 'positive',
      icon: 'CreditCard',
      color: 'bg-accent-100 text-accent'
    },
    {
      title: 'Content Engagement',
      value: `${metrics?.contentEngagement || 0}%`,
      change: '-2.1%',
      changeType: 'negative',
      icon: 'TrendingUp',
      color: 'bg-warning-100 text-warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-text-primary">Platform Overview</h2>
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards?.map((metric, index) => (
          <div key={index} className="bg-surface rounded-lg border border-border p-6 shadow-civic">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric?.color}`}>
                <Icon name={metric?.icon} size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                metric?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={metric?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                <span>{metric?.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary mb-1">
                {typeof metric?.value === 'number' ? metric?.value?.toLocaleString() : metric?.value}
              </p>
              <p className="text-text-secondary text-sm">{metric?.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
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
              <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} />
              <Line type="monotone" dataKey="polls" stroke="#DC2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {subscriptionData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}% (${props?.payload?.count?.toLocaleString()} users)`,
                  name
                ]}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Recent System Activity</h3>
        <div className="space-y-4">
          {[
            { 
              action: 'New user registration spike detected', 
              time: '2 minutes ago', 
              type: 'info',
              icon: 'UserPlus'
            },
            { 
              action: 'Content flagged for review', 
              time: '5 minutes ago', 
              type: 'warning',
              icon: 'AlertTriangle'
            },
            { 
              action: 'Poll "Healthcare Reform" reached 10K responses', 
              time: '12 minutes ago', 
              type: 'success',
              icon: 'CheckCircle'
            },
            { 
              action: 'Subscription cancellation rate increased', 
              time: '18 minutes ago', 
              type: 'error',
              icon: 'AlertCircle'
            }
          ]?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity?.type === 'success' ? 'bg-success-100 text-success' :
                activity?.type === 'warning' ? 'bg-warning-100 text-warning' :
                activity?.type === 'error'? 'bg-error-100 text-error' : 'bg-primary-100 text-primary'
              }`}>
                <Icon name={activity?.icon} size={16} />
              </div>
              <div className="flex-1">
                <p className="text-text-primary text-sm">{activity?.action}</p>
                <p className="text-text-secondary text-xs">{activity?.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;