import api from './api';

export const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getDeveloperStats: async () => {
    const response = await api.get('/dashboard/developer');
    return response.data;
  },
};
