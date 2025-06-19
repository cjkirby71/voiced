// src/pages/admin-dashboard/components/SubscriptionAnalytics.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from 'components/AppIcon';

const SubscriptionAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeMetric, setActiveMetric] = useState('revenue');

  // Mock analytics data
  const revenueData = [
    { name: 'Week 1', revenue: 2400, conversions: 12, cancellations: 3 },
    { name: 'Week 2', revenue: 1398, conversions: 8, cancellations: 2 },
    { name: 'Week 3', revenue: 9800, conversions: 45, cancellations: 8 },
    { name: 'Week 4', revenue: 3908, conversions: 18, cancellations: 5 }
  ];

  const subscriptionTiers = [
    { name: 'Free', value: 65, count: 6500, revenue: 0 },
    { name: 'Premium ($5)', value: 25, count: 2500, revenue: 12500 },
    { name: 'Pro ($15)', value: 10, count: 1000, revenue: 15000 }
  ];

  const usagePatterns = [
    { feature: 'Article Reading', free: 45, premium: 78, pro: 92 },
    { feature: 'Poll Participation', free: 23, premium: 56, pro: 84 },
    { feature: 'Rep Contact', free: 12, premium: 34, pro: 67 },
    { feature: 'Feedback Submission', free: 8, premium: 28, pro: 45 }
  ];

  const COLORS = ['#64748B', '#2563EB', '#DC2626'];

  const analyticsCards = [
    {
      title: 'Monthly Recurring Revenue',
      value: '$27,500',
      change: '+18.2%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'bg-success-100 text-success'
    },
    {
      title: 'Conversion Rate',
      value: '12.5%',
      change: '+3.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'bg-primary-100 text-primary'
    },
    {
      title: 'Churn Rate',
      value: '4.2%',
      change: '-0.8%',
      changeType: 'positive',
      icon: 'UserMinus',
      color: 'bg-error-100 text-error'
    },
    {
      title: 'Avg Revenue Per User',
      value: '$8.75',
      change: '+5.3%',
      changeType: 'positive',
      icon: 'Users',
      color: 'bg-warning-100 text-warning'
    }
  ];

  const handleExportData = (format) => {
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <h2 className="text-xl font-heading font-bold text-text-primary">Subscription Analytics</h2>
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
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
          
          {/* Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExportData('csv')}
              className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="Download" size={16} />
              <span className="text-sm">CSV</span>
            </button>
            <button
              onClick={() => handleExportData('pdf')}
              className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <Icon name="FileText" size={16} />
              <span className="text-sm">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards?.map((card, index) => (
          <div key={index} className="bg-surface rounded-lg border border-border p-6 shadow-civic">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card?.color}`}>
                <Icon name={card?.icon} size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                card?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={card?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                <span>{card?.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary mb-1">{card?.value}</p>
              <p className="text-text-secondary text-sm">{card?.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-text-primary">Revenue Trends</h3>
            <select
              value={activeMetric}
              onChange={(e) => setActiveMetric(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
            >
              <option value="revenue">Revenue</option>
              <option value="conversions">Conversions</option>
              <option value="cancellations">Cancellations</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
              <Line 
                type="monotone" 
                dataKey={activeMetric} 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionTiers}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, revenue }) => `${name}: ${value}%`}
              >
                {subscriptionTiers?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}% (${props?.payload?.count?.toLocaleString()} users, $${props?.payload?.revenue?.toLocaleString()} revenue)`,
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

      {/* Usage Patterns */}
      <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Feature Usage by Tier</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={usagePatterns} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="feature" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="free" fill="#64748B" name="Free" />
            <Bar dataKey="premium" fill="#2563EB" name="Premium" />
            <Bar dataKey="pro" fill="#DC2626" name="Pro" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Subscription Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier Breakdown */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <h4 className="text-lg font-heading font-semibold text-text-primary mb-4">Tier Breakdown</h4>
          <div className="space-y-4">
            {subscriptionTiers?.map((tier, index) => (
              <div key={tier?.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS?.length] }}
                  ></div>
                  <span className="text-text-primary font-medium">{tier?.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-semibold">{tier?.count?.toLocaleString()}</p>
                  <p className="text-text-secondary text-sm">{tier?.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversions */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <h4 className="text-lg font-heading font-semibold text-text-primary mb-4">Recent Conversions</h4>
          <div className="space-y-3">
            {[
              { user: 'john.doe@email.com', from: 'Free', to: 'Premium', time: '2 hours ago' },
              { user: 'sarah.smith@email.com', from: 'Premium', to: 'Pro', time: '4 hours ago' },
              { user: 'mike.johnson@email.com', from: 'Free', to: 'Premium', time: '6 hours ago' },
              { user: 'emma.davis@email.com', from: 'Free', to: 'Pro', time: '8 hours ago' }
            ]?.map((conversion, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div>
                  <p className="text-text-primary text-sm font-medium">{conversion?.user}</p>
                  <p className="text-text-secondary text-xs">
                    {conversion?.from} → {conversion?.to}
                  </p>
                </div>
                <span className="text-text-secondary text-xs">{conversion?.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Churn Analysis */}
        <div className="bg-surface rounded-lg border border-border p-6 shadow-civic">
          <h4 className="text-lg font-heading font-semibold text-text-primary mb-4">Churn Reasons</h4>
          <div className="space-y-3">
            {[
              { reason: 'Price sensitivity', percentage: 35, count: 14 },
              { reason: 'Limited usage', percentage: 28, count: 11 },
              { reason: 'Technical issues', percentage: 18, count: 7 },
              { reason: 'Feature requests', percentage: 12, count: 5 },
              { reason: 'Other', percentage: 7, count: 3 }
            ]?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-primary text-sm">{item?.reason}</span>
                    <span className="text-text-secondary text-sm">{item?.count} users</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-error h-2 rounded-full" 
                      style={{ width: `${item?.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAnalytics;