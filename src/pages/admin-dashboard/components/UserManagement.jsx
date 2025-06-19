// src/pages/admin-dashboard/components/UserManagement.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const UserManagement = ({ adminRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'citizen',
      status: 'active',
      subscription: 'Premium',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      pollsParticipated: 25,
      articlesRead: 45
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'representative',
      status: 'active',
      subscription: 'Pro',
      joinDate: '2024-01-10',
      lastActive: '2024-01-20',
      pollsParticipated: 15,
      articlesRead: 30
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      role: 'citizen',
      status: 'suspended',
      subscription: 'Free',
      joinDate: '2024-01-05',
      lastActive: '2024-01-18',
      pollsParticipated: 5,
      articlesRead: 12
    }
  ];

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
  };

  const handleUserAction = (user, action) => {
    console.log(`Performing ${action} on user:`, user?.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success-50';
      case 'suspended': return 'text-error bg-error-50';
      case 'pending': return 'text-warning bg-warning-50';
      default: return 'text-text-secondary bg-secondary-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'representative': return 'text-primary bg-primary-50';
      case 'citizen': return 'text-accent bg-accent-50';
      default: return 'text-text-secondary bg-secondary-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        {/* Bulk Actions */}
        {selectedUsers?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {selectedUsers?.length} selected
            </span>
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 bg-success text-white text-sm rounded-lg hover:bg-success-600 transition-colors duration-200"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-3 py-1 bg-warning text-white text-sm rounded-lg hover:bg-warning-600 transition-colors duration-200"
            >
              Suspend
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-error text-white text-sm rounded-lg hover:bg-error-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-lg border border-border shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        setSelectedUsers(filteredUsers?.map(user => user?.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    className="rounded border-border focus:ring-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-secondary-50 transition-colors duration-200">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleUserSelect(user?.id)}
                      className="rounded border-border focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{user?.name}</p>
                        <p className="text-text-secondary text-sm">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user?.role)}`}>
                      {user?.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user?.status)}`}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-text-primary">{user?.subscription}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="text-text-primary">{user?.pollsParticipated} polls</p>
                      <p className="text-text-secondary">{user?.articlesRead} articles</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 text-text-secondary hover:text-primary transition-colors duration-200"
                        title="View Details"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => handleUserAction(user, 'edit')}
                        className="p-1 text-text-secondary hover:text-warning transition-colors duration-200"
                        title="Edit User"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                      {user?.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user, 'suspend')}
                          className="p-1 text-text-secondary hover:text-error transition-colors duration-200"
                          title="Suspend User"
                        >
                          <Icon name="UserX" size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user, 'activate')}
                          className="p-1 text-text-secondary hover:text-success transition-colors duration-200"
                          title="Activate User"
                        >
                          <Icon name="UserCheck" size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-200 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-text-primary">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                  <p className="text-text-primary">{selectedUser?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                  <p className="text-text-primary">{selectedUser?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Join Date</label>
                  <p className="text-text-primary">{selectedUser?.joinDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Last Active</label>
                  <p className="text-text-primary">{selectedUser?.lastActive}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;