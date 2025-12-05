import api from './api';

export const usersService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getLeaderRequests: async () => {
    try {
      const response = await api.get('/users/leader-requests');
      console.log('📋 Réponse API getLeaderRequests:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des demandes de leader:', error);
      console.error('Détails:', error.response?.data || error.message);
      throw error;
    }
  },

  updateLeaderStatus: async (id, status) => {
    const response = await api.put(`/users/${id}/leader-status`, { status });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.put(`/users/${id}/status`, { status });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  }
};

