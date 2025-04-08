import axios from 'axios';

const BASE_URL = 'https://fest-b2b-backend.onrender.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient; 