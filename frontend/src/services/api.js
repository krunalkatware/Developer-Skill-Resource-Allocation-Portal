import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('devresource_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.message === 'Network Error'
        ? 'Cannot connect to DevResource backend. Please ensure the server is running on port 5000.'
        : error.message);
    return Promise.reject(new Error(message));
  }
);

export default api;
