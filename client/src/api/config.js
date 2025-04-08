import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient; 