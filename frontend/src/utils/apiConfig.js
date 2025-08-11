// API configuration for production and development

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getApiUrl = (endpoint = '') => {
  return API_BASE_URL;
};

export const API_URL = API_BASE_URL;
export const SHARING_API_URL = API_BASE_URL;