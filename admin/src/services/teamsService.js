import api from './api';

export const teamsService = {
  getAllTeams: async (params = {}) => {
    try {
      const response = await api.get('/teams', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllTeams:', error);
      throw error;
    }
  },

  getTeamById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  getLeaderboard: async (limit = 10) => {
    const response = await api.get('/teams/leaderboard', { params: { limit } });
    return response.data;
  },

  createTeam: async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  updateTeam: async (id, teamData) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },

  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },

  addMember: async (teamId, userId) => {
    const response = await api.post(`/teams/${teamId}/members`, { userId });
    return response.data;
  },

  removeMember: async (teamId, memberId) => {
    const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
    return response.data;
  },

  addBadge: async (teamId, badge) => {
    const response = await api.post(`/teams/${teamId}/badges`, { badge });
    return response.data;
  }
};

