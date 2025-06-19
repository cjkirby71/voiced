import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import PollCard from './components/PollCard';
import FilterChips from './components/FilterChips';

const PollingInterface = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock poll data
  const polls = [
    {
      id: 1,
      title: "Federal Infrastructure Investment Act (HR-2847)",
      question: "Should Congress approve the $2.3 trillion infrastructure investment package for roads, bridges, and broadband expansion?",
      category: "Economy",
      status: "active",
      timeRemaining: "4 days",
      totalVotes: 15847,
      results: {
        yes: 42,
        no: 35,
        maybe: 23
      },
      userVote: null,
      description: `The Federal Infrastructure Investment Act proposes significant funding for:
• Highway and bridge repairs nationwide
• Rural broadband expansion
• Clean energy grid modernization
• Public transit improvements
• Water system upgrades`,
      billNumber: "HR-2847",
      sponsor: "Rep. Sarah Johnson (D-CA)",
      dateIntroduced: "March 15, 2024"
    },
    {
      id: 2,
      title: "Healthcare Price Transparency Act (S-1456)",
      question: "Should hospitals be required to publish all procedure costs and insurance negotiated rates publicly?",
      category: "Healthcare",
      status: "active",
      timeRemaining: "2 days",
      totalVotes: 23156,
      results: {
        yes: 67,
        no: 18,
        maybe: 15
      },
      userVote: null,
      description: `This legislation would mandate:
• Public disclosure of all medical procedure costs
• Insurance company negotiated rate transparency
• Real-time pricing updates on hospital websites
• Standardized cost comparison tools
• Penalties for non-compliance`,
      billNumber: "S-1456",
      sponsor: "Sen. Michael Chen (R-TX)",
      dateIntroduced: "February 28, 2024"
    },
    {
      id: 3,
      title: "Climate Action and Jobs Act (HR-3921)",
      question: "Should the federal government invest $500 billion in renewable energy jobs and carbon reduction programs?",
      category: "Environment",
      status: "active",
      timeRemaining: "6 days",
      totalVotes: 18923,
      results: {
        yes: 54,
        no: 31,
        maybe: 15
      },
      userVote: null,
      description: `The Climate Action and Jobs Act includes:
• $300B for renewable energy infrastructure
• $150B for green job training programs
• $50B for carbon capture technology
• Tax incentives for clean energy adoption
• Environmental justice community investments`,
      billNumber: "HR-3921",
      sponsor: "Rep. Maria Rodriguez (D-NY)",
      dateIntroduced: "March 8, 2024"
    },
    {
      id: 4,
      title: "Border Security Enhancement Act (S-892)",
      question: "Should Congress allocate additional $15 billion for border security technology and personnel?",
      category: "Defense",
      status: "completed",
      timeRemaining: null,
      totalVotes: 31245,
      results: {
        yes: 48,
        no: 39,
        maybe: 13
      },
      userVote: "yes",
      description: `This comprehensive border security package provides:
• Advanced surveillance technology deployment
• Additional border patrol agent hiring
• Enhanced port of entry infrastructure
• Drug detection equipment upgrades
• Immigration court system expansion`,
      billNumber: "S-892",
      sponsor: "Sen. Robert Williams (R-AZ)",
      dateIntroduced: "January 22, 2024"
    },
    {
      id: 5,
      title: "Student Loan Relief Extension Act (HR-1847)",
      question: "Should federal student loan payment pause be extended for another 12 months?",
      category: "Economy",
      status: "completed",
      timeRemaining: null,
      totalVotes: 28934,
      results: {
        yes: 61,
        no: 28,
        maybe: 11
      },
      userVote: "maybe",
      description: `The Student Loan Relief Extension would provide:
• 12-month payment pause extension
• 0% interest accrual during pause
• Income-driven repayment plan improvements
• Public service loan forgiveness expansion
• Financial hardship protection measures`,
      billNumber: "HR-1847",
      sponsor: "Rep. Jennifer Davis (D-MA)",
      dateIntroduced: "February 5, 2024"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Polls', count: polls.length },
    { value: 'active', label: 'Active', count: polls.filter(p => p.status === 'active').length },
    { value: 'completed', label: 'Completed', count: polls.filter(p => p.status === 'completed').length },
    { value: 'Healthcare', label: 'Healthcare', count: polls.filter(p => p.category === 'Healthcare').length },
    { value: 'Economy', label: 'Economy', count: polls.filter(p => p.category === 'Economy').length },
    { value: 'Environment', label: 'Environment', count: polls.filter(p => p.category === 'Environment').length },
    { value: 'Defense', label: 'Defense', count: polls.filter(p => p.category === 'Defense').length }
  ];

  const getFilteredPolls = () => {
    if (selectedFilter === 'all') return polls;
    if (selectedFilter === 'active' || selectedFilter === 'completed') {
      return polls.filter(poll => poll.status === selectedFilter);
    }
    return polls.filter(poll => poll.category === selectedFilter);
  };

  const filteredPolls = getFilteredPolls();
  const activePolls = filteredPolls.filter(poll => poll.status === 'active');
  const completedPolls = filteredPolls.filter(poll => poll.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-text-primary">
                Federal Polling Interface
              </h1>
              <p className="text-text-secondary">
                Participate in weekly federal polls and make your voice heard on key legislation
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Vote" size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Active Polls</p>
                  <p className="text-xl font-semibold text-text-primary">
                    {polls.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} className="text-success" />
                <div>
                  <p className="text-sm text-text-secondary">Total Participants</p>
                  <p className="text-xl font-semibold text-text-primary">
                    {polls.reduce((sum, poll) => sum + poll.totalVotes, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-warning" />
                <div>
                  <p className="text-sm text-text-secondary">Your Votes</p>
                  <p className="text-xl font-semibold text-text-primary">
                    {polls.filter(p => p.userVote).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-accent" />
                <div>
                  <p className="text-sm text-text-secondary">Ending Soon</p>
                  <p className="text-xl font-semibold text-text-primary">
                    {polls.filter(p => p.status === 'active' && parseInt(p.timeRemaining) <= 3).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <FilterChips 
          options={filterOptions}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />

        {/* Polls Content */}
        <div className="space-y-8">
          {/* Active Polls Section */}
          {activePolls.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="Clock" size={20} className="text-primary" />
                <h2 className="text-xl font-heading font-semibold text-text-primary">
                  Active Polls ({activePolls.length})
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {activePolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Polls Section */}
          {completedPolls.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <h2 className="text-xl font-heading font-semibold text-text-primary">
                  Completed Polls ({completedPolls.length})
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {completedPolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredPolls.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={32} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                No polls found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your filter to see more polls.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollingInterface;