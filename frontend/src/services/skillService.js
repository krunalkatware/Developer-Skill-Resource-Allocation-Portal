import api from './api';

export const skillService = {
  getSkills: async (params = {}) => {
    const response = await api.get('/skills', { params });
    return response.data;
  },

  createSkill: async (data) => {
    const response = await api.post('/skills', data);
    return response.data;
  },

  updateSkill: async (id, data) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};
