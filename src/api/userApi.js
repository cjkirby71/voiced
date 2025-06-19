// src/api/userApi.js
import axios from 'axios';

// Base URL for user API - should be configured in environment variables
const USER_API_BASE_URL = process.env.REACT_APP_USER_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const userApiClient = axios.create({
  baseURL: USER_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include authentication token if available
userApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get current user profile
 * @returns {Promise} Promise that resolves to user profile data
 */
const getCurrentUser = () => {
  return userApiClient.get('/users/profile')
  .then(response => {
    return {
      success: true,
      data: response.data,
      user: response.data?.user || {}
    };
  })
  .catch(error => {
    console.error('Error fetching current user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user profile',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user by ID
 * @param {string|number} userId - The user ID
 * @returns {Promise} Promise that resolves to user data
 */
const getUserById = (userId) => {
  return userApiClient.get(`/users/${userId}`)
  .then(response => {
    return {
      success: true,
      data: response.data,
      user: response.data?.user || {}
    };
  })
  .catch(error => {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user',
      code: error.response?.status || 500
    };
  });
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} Promise that resolves to updated user data
 */
const updateUserProfile = (userData) => {
  return userApiClient.put('/users/profile', userData)
  .then(response => {
    return {
      success: true,
      data: response.data,
      user: response.data?.user || {},
      message: 'Profile updated successfully'
    };
  })
  .catch(error => {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
      code: error.response?.status || 500
    };
  });
};

/**
 * Update user preferences
 * @param {Object} preferences - User preferences to update
 * @returns {Promise} Promise that resolves to updated preferences
 */
const updateUserPreferences = (preferences) => {
  return userApiClient.put('/users/preferences', { preferences })
  .then(response => {
    return {
      success: true,
      data: response.data,
      preferences: response.data?.preferences || {},
      message: 'Preferences updated successfully'
    };
  })
  .catch(error => {
    console.error('Error updating user preferences:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update preferences',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user preferences
 * @returns {Promise} Promise that resolves to user preferences
 */
const getUserPreferences = () => {
  return userApiClient.get('/users/preferences')
  .then(response => {
    return {
      success: true,
      data: response.data,
      preferences: response.data?.preferences || {}
    };
  })
  .catch(error => {
    console.error('Error fetching user preferences:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch preferences',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user activity history
 * @param {Object} options - Options for pagination and filtering
 * @returns {Promise} Promise that resolves to user activity data
 */
const getUserActivity = (options = {}) => {
  return userApiClient.get('/users/activity', { params: options })
  .then(response => {
    return {
      success: true,
      data: response.data,
      activities: response.data?.activities || [],
      total: response.data?.total || 0,
      pagination: response.data?.pagination || {}
    };
  })
  .catch(error => {
    console.error('Error fetching user activity:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user activity',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user statistics
 * @returns {Promise} Promise that resolves to user statistics
 */
const getUserStatistics = () => {
  return userApiClient.get('/users/statistics')
  .then(response => {
    return {
      success: true,
      data: response.data,
      statistics: response.data?.statistics || {}
    };
  })
  .catch(error => {
    console.error('Error fetching user statistics:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user statistics',
      code: error.response?.status || 500
    };
  });
};

/**
 * Update user avatar
 * @param {File} avatarFile - Avatar file to upload
 * @returns {Promise} Promise that resolves to updated user data
 */
const updateUserAvatar = (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  return userApiClient.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    return {
      success: true,
      data: response.data,
      avatarUrl: response.data?.avatarUrl || '',
      message: 'Avatar updated successfully'
    };
  })
  .catch(error => {
    console.error('Error updating user avatar:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update avatar',
      code: error.response?.status || 500
    };
  });
};

/**
 * Delete user account
 * @param {string} confirmationText - Confirmation text for account deletion
 * @returns {Promise} Promise that resolves to deletion result
 */
const deleteUserAccount = (confirmationText) => {
  if (confirmationText !== 'DELETE MY ACCOUNT') {
    return Promise.resolve({
      success: false,
      error: 'Invalid confirmation text',
      code: 400
    });
  }

  return userApiClient.delete('/users/account', {
    data: { confirmation: confirmationText }
  })
  .then(response => {
    return {
      success: true,
      data: response.data,
      message: 'Account deleted successfully'
    };
  })
  .catch(error => {
    console.error('Error deleting user account:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete account',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user's subscriptions
 * @returns {Promise} Promise that resolves to subscription data
 */
const getUserSubscriptions = () => {
  return userApiClient.get('/users/subscriptions')
  .then(response => {
    return {
      success: true,
      data: response.data,
      subscriptions: response.data?.subscriptions || [],
      activeSubscription: response.data?.activeSubscription || null
    };
  })
  .catch(error => {
    console.error('Error fetching user subscriptions:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch subscriptions',
      code: error.response?.status || 500
    };
  });
};

/**
 * Update user subscription
 * @param {Object} subscriptionData - Subscription data to update
 * @returns {Promise} Promise that resolves to updated subscription data
 */
const updateUserSubscription = (subscriptionData) => {
  return userApiClient.put('/users/subscription', subscriptionData)
  .then(response => {
    return {
      success: true,
      data: response.data,
      subscription: response.data?.subscription || {},
      message: 'Subscription updated successfully'
    };
  })
  .catch(error => {
    console.error('Error updating user subscription:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update subscription',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user notifications
 * @param {Object} options - Options for pagination and filtering
 * @returns {Promise} Promise that resolves to notifications data
 */
const getUserNotifications = (options = {}) => {
  return userApiClient.get('/users/notifications', { params: options })
  .then(response => {
    return {
      success: true,
      data: response.data,
      notifications: response.data?.notifications || [],
      unreadCount: response.data?.unreadCount || 0,
      total: response.data?.total || 0
    };
  })
  .catch(error => {
    console.error('Error fetching user notifications:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch notifications',
      code: error.response?.status || 500
    };
  });
};

/**
 * Mark notification as read
 * @param {string|number} notificationId - Notification ID
 * @returns {Promise} Promise that resolves to updated notification
 */
const markNotificationAsRead = (notificationId) => {
  return userApiClient.put(`/users/notifications/${notificationId}/read`)
  .then(response => {
    return {
      success: true,
      data: response.data,
      message: 'Notification marked as read'
    };
  })
  .catch(error => {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to mark notification as read',
      code: error.response?.status || 500
    };
  });
};

/**
 * Transform user data for UI consumption
 * @param {Object} userData - Raw user data from API
 * @returns {Object} Transformed user data
 */
const transformUserData = (userData) => {
  if (!userData) return {};

  return {
    id: userData.id,
    name: userData.name || 'Unknown User',
    email: userData.email || '',
    avatar: userData.avatar || userData.photoUrl || null,
    location: {
      address: userData.location?.address || '',
      city: userData.location?.city || '',
      state: userData.location?.state || '',
      zipCode: userData.location?.zipCode || '',
      district: userData.location?.district || ''
    },
    preferences: {
      emailNotifications: userData.preferences?.emailNotifications ?? true,
      pollReminders: userData.preferences?.pollReminders ?? true,
      newsAlerts: userData.preferences?.newsAlerts ?? false,
      representativeUpdates: userData.preferences?.representativeUpdates ?? true,
      language: userData.preferences?.language || 'en',
      timezone: userData.preferences?.timezone || 'UTC'
    },
    profile: {
      bio: userData.profile?.bio || '',
      dateOfBirth: userData.profile?.dateOfBirth || null,
      phone: userData.profile?.phone || '',
      website: userData.profile?.website || ''
    },
    subscription: {
      tier: userData.subscription?.tier || 'free',
      status: userData.subscription?.status || 'inactive',
      expiresAt: userData.subscription?.expiresAt || null
    },
    statistics: {
      pollsParticipated: userData.statistics?.pollsParticipated || 0,
      messagesSent: userData.statistics?.messagesSent || 0,
      articlesShared: userData.statistics?.articlesShared || 0
    },
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updatedAt || new Date().toISOString(),
    lastLoginAt: userData.lastLoginAt || null,
    isVerified: userData.isVerified || false,
    role: userData.role || 'user'
  };
};

/**
 * Validate user data before submission
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
const validateUserData = (userData) => {
  const errors = [];
  
  if (!userData?.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!userData?.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Invalid email format');
  }
  
  if (userData?.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(userData.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Get default user preferences
 * @returns {Object} Default preferences object
 */
const getDefaultPreferences = () => {
  return {
    emailNotifications: true,
    pollReminders: true,
    newsAlerts: false,
    representativeUpdates: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    theme: 'light',
    notifications: {
      desktop: false,
      mobile: true,
      email: true
    }
  };
};

export {
  getCurrentUser,
  getUserById,
  updateUserProfile,
  updateUserPreferences,
  getUserPreferences,
  getUserActivity,
  getUserStatistics,
  updateUserAvatar,
  deleteUserAccount,
  getUserSubscriptions,
  updateUserSubscription,
  getUserNotifications,
  markNotificationAsRead,
  transformUserData,
  validateUserData,
  getDefaultPreferences
};

export default {
  getCurrentUser,
  getUserById,
  updateUserProfile,
  updateUserPreferences,
  getUserPreferences,
  getUserActivity,
  getUserStatistics,
  updateUserAvatar,
  deleteUserAccount,
  getUserSubscriptions,
  updateUserSubscription,
  getUserNotifications,
  markNotificationAsRead,
  transformUserData,
  validateUserData,
  getDefaultPreferences
};