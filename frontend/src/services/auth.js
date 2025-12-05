import api from './api';
import { jwtDecode } from 'jwt-decode'; // Correction ici : import nommé

export const authService = {
  // Connexion
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  // Inscription membre
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Demande de devenir leader
  requestLeader: async (formData) => {
    const response = await api.post('/users/leader-request', formData);
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtenir utilisateur connecté
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Vérifier si token valide
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token); // Utilisation correcte
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  },

  // Obtenir rôle utilisateur
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },
};