// src/context/PollContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  polls: [],
  currentPoll: null,
  userVotes: {},
  pollStats: {},
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    status: 'active',
    sortBy: 'created_at',
    sortOrder: 'desc'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

// Action types
const POLL_ACTIONS = {
  FETCH_POLLS_START: 'FETCH_POLLS_START',
  FETCH_POLLS_SUCCESS: 'FETCH_POLLS_SUCCESS',
  FETCH_POLLS_FAILURE: 'FETCH_POLLS_FAILURE',
  SET_CURRENT_POLL: 'SET_CURRENT_POLL',
  VOTE_START: 'VOTE_START',
  VOTE_SUCCESS: 'VOTE_SUCCESS',
  VOTE_FAILURE: 'VOTE_FAILURE',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  UPDATE_PAGINATION: 'UPDATE_PAGINATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_POLL: 'ADD_POLL',
  UPDATE_POLL: 'UPDATE_POLL',
  DELETE_POLL: 'DELETE_POLL'
};

// Reducer function
const pollReducer = (state, action) => {
  switch (action.type) {
    case POLL_ACTIONS.FETCH_POLLS_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case POLL_ACTIONS.FETCH_POLLS_SUCCESS:
      return {
        ...state,
        polls: action.payload.polls,
        pollStats: action.payload.stats || {},
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.polls?.length || 0
        },
        isLoading: false,
        error: null
      };
    
    case POLL_ACTIONS.FETCH_POLLS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        polls: []
      };
    
    case POLL_ACTIONS.SET_CURRENT_POLL:
      return {
        ...state,
        currentPoll: action.payload,
        error: null
      };
    
    case POLL_ACTIONS.VOTE_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case POLL_ACTIONS.VOTE_SUCCESS:
      const { pollId, optionId, voteData } = action.payload;
      return {
        ...state,
        userVotes: {
          ...state.userVotes,
          [pollId]: optionId
        },
        polls: state.polls?.map(poll => 
          poll?.id === pollId ? { ...poll, ...voteData } : poll
        ),
        currentPoll: state.currentPoll?.id === pollId 
          ? { ...state.currentPoll, ...voteData }
          : state.currentPoll,
        isLoading: false,
        error: null
      };
    
    case POLL_ACTIONS.VOTE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    
    case POLL_ACTIONS.UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 } // Reset to first page
      };
    
    case POLL_ACTIONS.UPDATE_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    
    case POLL_ACTIONS.ADD_POLL:
      return {
        ...state,
        polls: [action.payload, ...state.polls],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        }
      };
    
    case POLL_ACTIONS.UPDATE_POLL:
      return {
        ...state,
        polls: state.polls?.map(poll => 
          poll?.id === action.payload.id ? { ...poll, ...action.payload } : poll
        ),
        currentPoll: state.currentPoll?.id === action.payload.id 
          ? { ...state.currentPoll, ...action.payload }
          : state.currentPoll
      };
    
    case POLL_ACTIONS.DELETE_POLL:
      return {
        ...state,
        polls: state.polls?.filter(poll => poll?.id !== action.payload),
        currentPoll: state.currentPoll?.id === action.payload ? null : state.currentPoll,
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1)
        }
      };
    
    case POLL_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const PollContext = createContext();

// Provider component
export const PollProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pollReducer, initialState);

  // Mock data for development
  const mockPolls = [
    {
      id: '1',
      title: 'Federal Budget Allocation Priorities',
      description: 'How should the federal government prioritize budget allocation for the next fiscal year?',
      category: 'budget',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      ends_at: '2024-02-15T23:59:59Z',
      total_votes: 15420,
      options: [
        { id: 'opt1', text: 'Healthcare & Social Services', votes: 6200 },
        { id: 'opt2', text: 'Education & Research', votes: 4100 },
        { id: 'opt3', text: 'Infrastructure & Transportation', votes: 3200 },
        { id: 'opt4', text: 'Defense & National Security', votes: 1920 }
      ]
    },
    {
      id: '2',
      title: 'Climate Change Action Plan',
      description: 'Which climate change initiative should receive the highest priority?',
      category: 'environment',
      status: 'active',
      created_at: '2024-01-10T14:30:00Z',
      ends_at: '2024-03-10T23:59:59Z',
      total_votes: 8750,
      options: [
        { id: 'opt1', text: 'Renewable Energy Investment', votes: 3800 },
        { id: 'opt2', text: 'Carbon Emission Reduction', votes: 2900 },
        { id: 'opt3', text: 'Green Transportation', votes: 1600 },
        { id: 'opt4', text: 'Environmental Education', votes: 450 }
      ]
    },
    {
      id: '3',
      title: 'Digital Privacy Rights',
      description: 'How should the government balance digital privacy with national security?',
      category: 'technology',
      status: 'active',
      created_at: '2024-01-05T09:15:00Z',
      ends_at: '2024-02-05T23:59:59Z',
      total_votes: 12300,
      options: [
        { id: 'opt1', text: 'Stronger Privacy Protections', votes: 7400 },
        { id: 'opt2', text: 'Balanced Approach', votes: 3200 },
        { id: 'opt3', text: 'Enhanced Security Measures', votes: 1700 }
      ]
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    const initializePolls = () => {
      dispatch({
        type: POLL_ACTIONS.FETCH_POLLS_SUCCESS,
        payload: {
          polls: mockPolls,
          total: mockPolls.length,
          stats: {
            totalPolls: mockPolls.length,
            activePolls: mockPolls.filter(p => p?.status === 'active').length,
            totalVotes: mockPolls.reduce((sum, poll) => sum + (poll?.total_votes || 0), 0)
          }
        }
      });
    };

    initializePolls();
  }, []);

  // Action creators
  const fetchPolls = async (filters = {}) => {
    dispatch({ type: POLL_ACTIONS.FETCH_POLLS_START });
    
    try {
      // Mock API call - replace with actual API integration
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          let filteredPolls = [...mockPolls];
          
          // Apply filters
          if (filters.category && filters.category !== 'all') {
            filteredPolls = filteredPolls.filter(poll => poll?.category === filters.category);
          }
          
          if (filters.status && filters.status !== 'all') {
            filteredPolls = filteredPolls.filter(poll => poll?.status === filters.status);
          }
          
          // Apply sorting
          if (filters.sortBy) {
            filteredPolls.sort((a, b) => {
              const aVal = a?.[filters.sortBy];
              const bVal = b?.[filters.sortBy];
              
              if (filters.sortOrder === 'desc') {
                return bVal > aVal ? 1 : -1;
              }
              return aVal > bVal ? 1 : -1;
            });
          }
          
          resolve({
            polls: filteredPolls,
            total: filteredPolls.length,
            stats: {
              totalPolls: filteredPolls.length,
              activePolls: filteredPolls.filter(p => p?.status === 'active').length,
              totalVotes: filteredPolls.reduce((sum, poll) => sum + (poll?.total_votes || 0), 0)
            }
          });
        }, 800);
      });
      
      dispatch({ 
        type: POLL_ACTIONS.FETCH_POLLS_SUCCESS, 
        payload: response 
      });
      
      return { success: true, data: response };
    } catch (error) {
      dispatch({ 
        type: POLL_ACTIONS.FETCH_POLLS_FAILURE, 
        payload: { error: error.message } 
      });
      
      return { success: false, error: error.message };
    }
  };

  const votePoll = async (pollId, optionId) => {
    dispatch({ type: POLL_ACTIONS.VOTE_START });
    
    try {
      // Mock API call - replace with actual API integration
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if user has already voted
          if (state.userVotes[pollId]) {
            reject(new Error('You have already voted on this poll'));
            return;
          }
          
          // Find the poll and update vote counts
          const poll = mockPolls.find(p => p?.id === pollId);
          if (!poll) {
            reject(new Error('Poll not found'));
            return;
          }
          
          const updatedOptions = poll.options?.map(opt => 
            opt?.id === optionId 
              ? { ...opt, votes: opt.votes + 1 }
              : opt
          );
          
          resolve({
            options: updatedOptions,
            total_votes: poll.total_votes + 1
          });
        }, 1000);
      });
      
      dispatch({ 
        type: POLL_ACTIONS.VOTE_SUCCESS, 
        payload: {
          pollId,
          optionId,
          voteData: response
        }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ 
        type: POLL_ACTIONS.VOTE_FAILURE, 
        payload: { error: error.message } 
      });
      
      return { success: false, error: error.message };
    }
  };

  const setCurrentPoll = (poll) => {
    dispatch({ type: POLL_ACTIONS.SET_CURRENT_POLL, payload: poll });
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: POLL_ACTIONS.UPDATE_FILTERS, payload: newFilters });
  };

  const updatePagination = (paginationData) => {
    dispatch({ type: POLL_ACTIONS.UPDATE_PAGINATION, payload: paginationData });
  };

  const addPoll = (pollData) => {
    const newPoll = {
      ...pollData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      total_votes: 0,
      status: 'active'
    };
    dispatch({ type: POLL_ACTIONS.ADD_POLL, payload: newPoll });
    return newPoll;
  };

  const updatePoll = (pollId, updateData) => {
    dispatch({ type: POLL_ACTIONS.UPDATE_POLL, payload: { id: pollId, ...updateData } });
  };

  const deletePoll = (pollId) => {
    dispatch({ type: POLL_ACTIONS.DELETE_POLL, payload: pollId });
  };

  const clearError = () => {
    dispatch({ type: POLL_ACTIONS.CLEAR_ERROR });
  };

  // Helper functions
  const getPollById = (pollId) => {
    return state.polls?.find(poll => poll?.id === pollId) || null;
  };

  const hasUserVoted = (pollId) => {
    return Boolean(state.userVotes[pollId]);
  };

  const getUserVote = (pollId) => {
    return state.userVotes[pollId] || null;
  };

  const getActivePollsCount = () => {
    return state.polls?.filter(poll => poll?.status === 'active').length || 0;
  };

  const value = {
    // State
    ...state,
    
    // Actions
    fetchPolls,
    votePoll,
    setCurrentPoll,
    updateFilters,
    updatePagination,
    addPoll,
    updatePoll,
    deletePoll,
    clearError,
    
    // Helper functions
    getPollById,
    hasUserVoted,
    getUserVote,
    getActivePollsCount
  };

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  );
};

// Custom hook to use poll context
export const usePoll = () => {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};

export default PollContext;