import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fest-b2b-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

export default apiClient; 