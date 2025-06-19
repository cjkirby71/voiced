// src/api/civicApi.js
import axios from 'axios';

// Base URL for Google Civic Information API
const CIVIC_API_BASE_URL = 'https://www.googleapis.com/civicinfo/v2';

// Get API key from environment variables
const API_KEY = process.env.REACT_APP_GOOGLE_CIVIC_API_KEY;

// Create axios instance with default configuration
const civicApiClient = axios.create({
  baseURL: CIVIC_API_BASE_URL,
  timeout: 10000,
  params: {
    key: API_KEY
  }
});

/**
 * Get representatives by address
 * @param {string} address - The address to lookup representatives for
 * @param {boolean} includeOffices - Whether to include office information
 * @returns {Promise} Promise that resolves to representatives data
 */
const getRepresentativesByAddress = (address, includeOffices = true) => {
  return civicApiClient.get('/representatives', {
    params: {
      address: address,
      includeOffices: includeOffices,
      levels: ['federal', 'state', 'local'],
      roles: ['legislatorUpperBody', 'legislatorLowerBody', 'executiveHead']
    }
  })
  .then(response => {
    return {
      success: true,
      data: response.data,
      representatives: response.data?.officials || [],
      offices: response.data?.offices || [],
      normalizedInput: response.data?.normalizedInput || {}
    };
  })
  .catch(error => {
    console.error('Error fetching representatives:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to fetch representatives',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get voter information by address
 * @param {string} address - The address to lookup voter information for
 * @param {string} electionId - Optional election ID (defaults to upcoming elections)
 * @returns {Promise} Promise that resolves to voter information
 */
const getVoterInfo = (address, electionId = null) => {
  const params = { address: address };
  if (electionId) {
    params.electionId = electionId;
  }

  return civicApiClient.get('/voterinfo', { params })
  .then(response => {
    return {
      success: true,
      data: response.data,
      election: response.data?.election || {},
      pollingLocations: response.data?.pollingLocations || [],
      contests: response.data?.contests || [],
      normalizedInput: response.data?.normalizedInput || {}
    };
  })
  .catch(error => {
    console.error('Error fetching voter info:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to fetch voter information',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get list of available elections
 * @returns {Promise} Promise that resolves to elections data
 */
const getElections = () => {
  return civicApiClient.get('/elections')
  .then(response => {
    return {
      success: true,
      data: response.data,
      elections: response.data?.elections || []
    };
  })
  .catch(error => {
    console.error('Error fetching elections:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to fetch elections',
      code: error.response?.status || 500
    };
  });
};

/**
 * Get divisions by coordinates or address
 * @param {string} query - Address or coordinates to lookup divisions for
 * @returns {Promise} Promise that resolves to divisions data
 */
const getDivisions = (query) => {
  return civicApiClient.get('/divisions', {
    params: {
      query: query
    }
  })
  .then(response => {
    return {
      success: true,
      data: response.data,
      results: response.data?.results || {}
    };
  })
  .catch(error => {
    console.error('Error fetching divisions:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to fetch divisions',
      code: error.response?.status || 500
    };
  });
};

/**
 * Transform representative data for UI consumption
 * @param {Object} representatives - Raw representatives data from API
 * @param {Object} offices - Raw offices data from API
 * @returns {Array} Transformed representatives array
 */
const transformRepresentativesData = (representatives, offices) => {
  if (!representatives || !offices) return [];

  const transformedData = [];
  
  offices.forEach(office => {
    if (office?.officialIndices) {
      office.officialIndices.forEach(index => {
        const representative = representatives[index];
        if (representative) {
          transformedData.push({
            id: `${office.divisionId}-${index}`,
            name: representative.name || 'Unknown',
            title: office.name || 'Unknown Office',
            party: representative.party || 'Unknown',
            phones: representative.phones || [],
            emails: representative.emails || [],
            urls: representative.urls || [],
            photoUrl: representative.photoUrl || null,
            address: representative.address?.[0] || null,
            channels: representative.channels || [],
            division: {
              id: office.divisionId,
              name: office.divisionId?.split('/')?.pop()?.replace(/[_-]/g, ' ') || 'Unknown Division'
            },
            levels: office.levels || [],
            roles: office.roles || []
          });
        }
      });
    }
  });
  
  return transformedData;
};

/**
 * Validate address format for API calls
 * @param {string} address - Address to validate
 * @returns {boolean} Whether address is valid
 */
const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  // Basic address validation - should contain at least some alphanumeric characters
  const trimmedAddress = address.trim();
  return trimmedAddress.length >= 5 && /[a-zA-Z0-9]/.test(trimmedAddress);
};

/**
 * Check if API key is configured
 * @returns {boolean} Whether API key is available
 */
const isApiKeyConfigured = () => {
  return Boolean(API_KEY && API_KEY.trim() !== '');
};

export {
  getRepresentativesByAddress,
  getVoterInfo,
  getElections,
  getDivisions,
  transformRepresentativesData,
  isValidAddress,
  isApiKeyConfigured
};

export default {
  getRepresentativesByAddress,
  getVoterInfo,
  getElections,
  getDivisions,
  transformRepresentativesData,
  isValidAddress,
  isApiKeyConfigured
};