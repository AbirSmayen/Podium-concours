import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          return { success: true, user, token };
        }
      }
      // Si la réponse n'est pas au format attendu
      const errorMessage = response.data.message || 
                          (response.data.errors && response.data.errors.join(', ')) ||
                          'Erreur de connexion';
      return { success: false, message: errorMessage };
    } catch (error) {
      // Gestion des erreurs de validation ou autres erreurs
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors && error.response.data.errors.join(', ')) ||
                          error.message || 
                          'Erreur de connexion';
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  }
};

