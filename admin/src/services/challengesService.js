import api from './api';

export const challengesService = {
  getAllChallenges: async (params = {}) => {
    try {
      const response = await api.get('/challenges', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllChallenges:', error);
      throw error;
    }
  },

  getActiveChallenges: async (params = {}) => {
    const response = await api.get('/challenges/active', { params });
    return response.data;
  },

  getChallengeById: async (id) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },

  createChallenge: async (challengeData) => {
    const response = await api.post('/challenges', challengeData);
    return response.data;
  },

  updateChallenge: async (id, challengeData) => {
    const response = await api.put(`/challenges/${id}`, challengeData);
    return response.data;
  },

  toggleChallenge: async (id) => {
    const response = await api.put(`/challenges/${id}/toggle`);
    return response.data;
  },

  deleteChallenge: async (id) => {
    const response = await api.delete(`/challenges/${id}`);
    return response.data;
  },

  getChallengeStats: async () => {
    const response = await api.get('/challenges/stats');
    return response.data;
  }
};

