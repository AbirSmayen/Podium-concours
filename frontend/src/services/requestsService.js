import api from './api';

export const requestsService = {
  submitRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  getTeamRequests: async () => {
    const response = await api.get('/requests/team');
    return response.data;
  },

  acceptRequest: async (requestId) => {
    const response = await api.put(`/requests/${requestId}/accept`);
    return response.data;
  },

  rejectRequest: async (requestId) => {
    const response = await api.put(`/requests/${requestId}/reject`);
    return response.data;
  }
};

