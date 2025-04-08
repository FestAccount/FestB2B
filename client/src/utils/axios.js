import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 20000, // Augmenter le timeout à 20 secondes
  withCredentials: false // Désactiver les credentials pour éviter les problèmes CORS
});

// Intercepteur pour le debug
api.interceptors.request.use(request => {
  console.log('Envoi de requête:', request.method, request.url, request.data);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Réponse reçue:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Erreur API:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse reçue:', error.request);
    }
    return Promise.reject(error);
  }
);

export default api; 