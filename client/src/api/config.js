import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://fest-b2b-backend.onrender.com/api';

console.log('API Base URL:', BASE_URL); // Debug log

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    baseURL: request.baseURL,
    method: request.method,
    headers: request.headers
  });
  return request;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      config: error.config,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
    return Promise.reject(error);
  }
);

export default apiClient; 