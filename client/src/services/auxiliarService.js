import axios from 'axios';
import API_URL from '../config/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const auxiliarService = {
  // Obtener todos los auxiliares
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/auxiliares`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener auxiliares' };
    }
  },

  // Crear auxiliar
  create: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/auxiliares`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear auxiliar' };
    }
  },

  // Eliminar auxiliar
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/auxiliares/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar auxiliar' };
    }
  }
};

export default auxiliarService;