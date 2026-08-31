import api from './api';

export const developerService = {
  getDevelopers: async (params = {}) => {
    const response = await api.get('/developers', { params });
    return response.data;
  },

  getDeveloperById: async (id) => {
    const response = await api.get(`/developers/${id}`);
    return response.data;
  },

  createDeveloper: async (data) => {
    const response = await api.post('/developers', data);
    return response.data;
  },

  updateDeveloper: async (id, data) => {
    const response = await api.put(`/developers/${id}`, data);
    return response.data;
  },

  deleteDeveloper: async (id) => {
    const response = await api.delete(`/developers/${id}`);
    return response.data;
  },
};
