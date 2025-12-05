import api from './api';

export const scoresService = {
  getAllScores: async (params = {}) => {
    try {
      const response = await api.get('/scores', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllScores:', error);
      throw error;
    }
  },

  getPendingScores: async () => {
    try {
      const response = await api.get('/scores/pending');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPendingScores:', error);
      throw error;
    }
  },

  getScoreById: async (id) => {
    const response = await api.get(`/scores/${id}`);
    return response.data;
  },

  validateScore: async (id, validationNote = '') => {
    const response = await api.put(`/scores/${id}/validate`, { validationNote });
    return response.data;
  },

  rejectScore: async (id, validationNote) => {
    const response = await api.put(`/scores/${id}/reject`, { validationNote });
    return response.data;
  },

  deleteScore: async (id) => {
    const response = await api.delete(`/scores/${id}`);
    return response.data;
  },

  getScoreStats: async () => {
    const response = await api.get('/scores/stats');
    return response.data;
  }
};

