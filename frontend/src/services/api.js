import axios from 'axios';
import { mockApi } from './mockApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

// Log pour vérifier
console.log('🔧 Configuration API:');
console.log('USE_MOCK:', USE_MOCK);
console.log('API_URL:', API_URL);

// API réelle
const realApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

realApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

realApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Adapter pour utiliser mock ou real API
const api = {
  // Users
  post: async (url, data) => {
    console.log('📤 POST:', url, 'Mock:', USE_MOCK);
    
    if (USE_MOCK) {
      if (url === '/users/login') return mockApi.login(data.email, data.password);
      if (url === '/users/register') return mockApi.register(data);
      if (url === '/users/leader-request') return mockApi.requestLeader(data);
      if (url === '/scores') return mockApi.submitScore(data);
    }
    return realApi.post(url, data);
  },

  get: async (url) => {
    console.log('📥 GET:', url, 'Mock:', USE_MOCK);
    
    if (USE_MOCK) {
      // Extraire l'ID si présent
      const teamMatch = url.match(/\/teams\/([^/?]+)/);
      const challengeMatch = url.match(/\/challenges\/([^/?]+)/);
      
      if (url === '/teams') return mockApi.getTeams();
      if (teamMatch) return mockApi.getTeam(teamMatch[1]);
      if (url === '/challenges') return mockApi.getChallenges();
      if (challengeMatch) return mockApi.getChallenge(challengeMatch[1]);
      if (url.startsWith('/scores')) {
        const params = {};
        const teamIdMatch = url.match(/teamId=([^&]+)/);
        if (teamIdMatch) params.teamId = teamIdMatch[1];
        return mockApi.getScores(params);
      }
    }
    return realApi.get(url);
  },

  patch: async (url, data) => {
    console.log('🔄 PATCH:', url, 'Mock:', USE_MOCK);
    
    if (USE_MOCK) {
      const teamMatch = url.match(/\/teams\/([^/?]+)/);
      if (teamMatch) return mockApi.updateTeam(teamMatch[1], data);
      
      const scoreMatch = url.match(/\/scores\/([^/]+)\/validate/);
      if (scoreMatch) return mockApi.validateScore(scoreMatch[1], data.validatedBy);
    }
    return realApi.patch(url, data);
  },

  delete: async (url) => {
    console.log('🗑️ DELETE:', url, 'Mock:', USE_MOCK);
    
    if (USE_MOCK) {
      const memberMatch = url.match(/\/teams\/([^/]+)\/members\/([^/]+)/);
      if (memberMatch) return mockApi.deleteTeamMember(memberMatch[1], memberMatch[2]);
    }
    return realApi.delete(url);
  },
};

export default api;