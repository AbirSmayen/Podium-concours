import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ Aucun token trouvé pour la requête:', config.url);
    }
    
    // Log des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 API ${config.method.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    // Log des réponses réussies pour déboguer
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API ${response.config.method.toUpperCase()} ${response.config.url}:`, response.data);
    }
    return response;
  },
  (error) => {
    // Log détaillé des erreurs
    console.error(`❌ Erreur API ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Token invalide ou expiré, déconnexion...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

