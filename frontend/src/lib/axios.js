import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      error.message = 'Request took too long. Please try again.';
    } else if (!error.response) {
      console.error('Network Error:', error.message);
      error.message = 'Cannot connect to server. Check your internet connection.';
    } else if (error.response.status === 429) {
      console.error('Rate Limited');
      error.message = 'Too many requests. Please slow down.';
    } else if (error.response.status >= 500) {
      console.error('Server Error:', error.response.status);
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default api;