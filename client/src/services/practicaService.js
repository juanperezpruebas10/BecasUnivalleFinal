import axios from 'axios';
import API_URL from '../config/api';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const practicaService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/practicas-internacionales`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener prácticas internacionales' };
    }
  },
  create: async (formData) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${API_URL}/practicas-internacionales`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear práctica internacional' };
    }
  }
};

export default practicaService;
