import { Platform } from 'react-native';

const API_PORT = 5000;

// Resolve dynamic API base URL for Web & Mobile environments
const getBaseUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:${API_PORT}/api`;
  }
  return `http://10.0.2.2:${API_PORT}/api`; // Android emulator fallback
};

const BASE_URL = getBaseUrl();

// Universal persistent storage helper (Web localStorage + fallback)
export const storage = {
  getItem: async (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage set error:', e);
    }
  },
  removeItem: async (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  },
};

/**
 * Universal HTTP request wrapper with auto-auth headers
 */
export const apiRequest = async (endpoint, { method = 'GET', body = null, token = null } = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Resolve token from argument or persistent storage
  const activeToken = token || (await storage.getItem('authToken'));

  const headers = {
    'Content-Type': 'application/json',
  };

  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      err.message = `Cannot reach backend API at ${BASE_URL}. Ensure server is running.`;
    }
    throw err;
  }
};

export const authApi = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  getProfile: (token) => apiRequest('/auth/profile', { method: 'GET', token }),
  getAdminUsers: (token) => apiRequest('/admin/users', { method: 'GET', token }),
};
