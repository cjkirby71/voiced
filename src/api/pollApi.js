// src/api/pollApi.js
import axios from 'axios';

// Base URL for poll API - should be configured in environment variables
const POLL_API_BASE_URL = process.env.REACT_APP_POLL_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const pollApiClient = axios.create({
  baseURL: POLL_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include authentication token if available
pollApiClient.interceptors.request.use(
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
 * Get all polls with optional filtering
 * @param {Object} filters - Filter options (status, category, limit, offset)
 * @returns {Promise} Promise that resolves to polls data
 */
const getPolls = (filters = {}) => {
  return pollApiClient.get('/polls', { params: filters })
  .then(response => {
    return {
      success: true,
      data: response.data,
      polls: response.data?.polls || [],
      total: response.data?.total || 0,
      pagination: response.data?.pagination || {}
    };
  })
  .catch(error => {
    console.error('Error fetching polls:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch polls',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get a specific poll by ID
 * @param {string|number} pollId - The poll ID
 * @returns {Promise} Promise that resolves to poll data
 */
const getPollById = (pollId) => {
  return pollApiClient.get(`/polls/${pollId}`)
  .then(response => {
    return {
      success: true,
      data: response.data,
      poll: response.data?.poll || {}
    };
  })
  .catch(error => {
    console.error('Error fetching poll:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch poll',
      code: error.response?.status || 500
    };
  });
};

/**
 * Create a new poll
 * @param {Object} pollData - Poll creation data
 * @returns {Promise} Promise that resolves to created poll data
 */
const createPoll = (pollData) => {
  const requiredFields = ['title', 'question', 'category', 'options'];
  const missingFields = requiredFields.filter(field => !pollData[field]);
  
  if (missingFields.length > 0) {
    return Promise.resolve({
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      code: 400
    });
  }

  return pollApiClient.post('/polls', pollData)
  .then(response => {
    return {
      success: true,
      data: response.data,
      poll: response.data?.poll || {},
      message: 'Poll created successfully'
    };
  })
  .catch(error => {
    console.error('Error creating poll:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create poll',
      code: error.response?.status || 500
    };
  });
};

/**
 * Update an existing poll
 * @param {string|number} pollId - The poll ID
 * @param {Object} pollData - Poll update data
 * @returns {Promise} Promise that resolves to updated poll data
 */
const updatePoll = (pollId, pollData) => {
  return pollApiClient.put(`/polls/${pollId}`, pollData)
  .then(response => {
    return {
      success: true,
      data: response.data,
      poll: response.data?.poll || {},
      message: 'Poll updated successfully'
    };
  })
  .catch(error => {
    console.error('Error updating poll:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update poll',
      code: error.response?.status || 500
    };
  });
};

/**
 * Delete a poll
 * @param {string|number} pollId - The poll ID
 * @returns {Promise} Promise that resolves to deletion result
 */
const deletePoll = (pollId) => {
  return pollApiClient.delete(`/polls/${pollId}`)
  .then(response => {
    return {
      success: true,
      data: response.data,
      message: 'Poll deleted successfully'
    };
  })
  .catch(error => {
    console.error('Error deleting poll:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete poll',
      code: error.response?.status || 500
    };
  });
};

/**
 * Submit a vote for a poll
 * @param {string|number} pollId - The poll ID
 * @param {Object} voteData - Vote data (optionId, userId)
 * @returns {Promise} Promise that resolves to vote result
 */
const submitVote = (pollId, voteData) => {
  if (!voteData?.optionId) {
    return Promise.resolve({
      success: false,
      error: 'Option ID is required to submit vote',
      code: 400
    });
  }

  return pollApiClient.post(`/polls/${pollId}/vote`, voteData)
  .then(response => {
    return {
      success: true,
      data: response.data,
      vote: response.data?.vote || {},
      poll: response.data?.poll || {},
      message: 'Vote submitted successfully'
    };
  })
  .catch(error => {
    console.error('Error submitting vote:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to submit vote',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get poll results
 * @param {string|number} pollId - The poll ID
 * @returns {Promise} Promise that resolves to poll results
 */
const getPollResults = (pollId) => {
  return pollApiClient.get(`/polls/${pollId}/results`)
  .then(response => {
    return {
      success: true,
      data: response.data,
      results: response.data?.results || {},
      totalVotes: response.data?.totalVotes || 0,
      breakdown: response.data?.breakdown || []
    };
  })
  .catch(error => {
    console.error('Error fetching poll results:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch poll results',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get user's vote history
 * @param {string|number} userId - The user ID (optional, defaults to current user)
 * @param {Object} options - Options for pagination and filtering
 * @returns {Promise} Promise that resolves to vote history
 */
const getUserVoteHistory = (userId = null, options = {}) => {
  const endpoint = userId ? `/users/${userId}/votes` : '/votes/history';
  
  return pollApiClient.get(endpoint, { params: options })
  .then(response => {
    return {
      success: true,
      data: response.data,
      votes: response.data?.votes || [],
      total: response.data?.total || 0,
      pagination: response.data?.pagination || {}
    };
  })
  .catch(error => {
    console.error('Error fetching vote history:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch vote history',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get poll categories
 * @returns {Promise} Promise that resolves to poll categories
 */
const getPollCategories = () => {
  return pollApiClient.get('/polls/categories')
  .then(response => {
    return {
      success: true,
      data: response.data,
      categories: response.data?.categories || []
    };
  })
  .catch(error => {
    console.error('Error fetching poll categories:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch poll categories',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get poll statistics
 * @param {Object} filters - Optional filters for statistics
 * @returns {Promise} Promise that resolves to poll statistics
 */
const getPollStatistics = (filters = {}) => {
  return pollApiClient.get('/polls/statistics', { params: filters })
  .then(response => {
    return {
      success: true,
      data: response.data,
      statistics: response.data?.statistics || {},
      trends: response.data?.trends || []
    };
  })
  .catch(error => {
    console.error('Error fetching poll statistics:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch poll statistics',
      code: error.response?.status || 500
    };
  });
};

/**
 * Transform poll data for UI consumption
 * @param {Object} pollData - Raw poll data from API
 * @returns {Object} Transformed poll data
 */
const transformPollData = (pollData) => {
  if (!pollData) return {};

  return {
    id: pollData.id,
    title: pollData.title || 'Untitled Poll',
    question: pollData.question || '',
    description: pollData.description || '',
    category: pollData.category || 'General',
    status: pollData.status || 'draft',
    createdAt: pollData.createdAt || new Date().toISOString(),
    updatedAt: pollData.updatedAt || new Date().toISOString(),
    startDate: pollData.startDate,
    endDate: pollData.endDate,
    totalVotes: pollData.totalVotes || 0,
    options: pollData.options?.map(option => ({
      id: option.id,
      text: option.text || '',
      votes: option.votes || 0,
      percentage: pollData.totalVotes > 0 ? ((option.votes || 0) / pollData.totalVotes * 100).toFixed(1) : 0
    })) || [],
    results: pollData.results || {},
    userVote: pollData.userVote || null,
    creator: pollData.creator || {},
    metadata: pollData.metadata || {}
  };
};

/**
 * Validate poll data before submission
 * @param {Object} pollData - Poll data to validate
 * @returns {Object} Validation result
 */
const validatePollData = (pollData) => {
  const errors = [];
  
  if (!pollData?.title?.trim()) {
    errors.push('Poll title is required');
  }
  
  if (!pollData?.question?.trim()) {
    errors.push('Poll question is required');
  }
  
  if (!pollData?.options || !Array.isArray(pollData.options) || pollData.options.length < 2) {
    errors.push('At least 2 poll options are required');
  }
  
  if (pollData?.options) {
    pollData.options.forEach((option, index) => {
      if (!option?.text?.trim()) {
        errors.push(`Option ${index + 1} text is required`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

export {
  getPolls,
  getPollById,
  createPoll,
  updatePoll,
  deletePoll,
  submitVote,
  getPollResults,
  getUserVoteHistory,
  getPollCategories,
  getPollStatistics,
  transformPollData,
  validatePollData
};

export default {
  getPolls,
  getPollById,
  createPoll,
  updatePoll,
  deletePoll,
  submitVote,
  getPollResults,
  getUserVoteHistory,
  getPollCategories,
  getPollStatistics,
  transformPollData,
  validatePollData
};