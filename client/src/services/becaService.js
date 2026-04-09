import axios from 'axios';
import API_URL from '../config/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const becaService = {
  // Obtener todas las becas
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/becas`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener becas' };
    }
  },

  // Obtener solo mis becas (para auxiliares en reportes)
  getMisBecas: async () => {
    try {
      const response = await axios.get(`${API_URL}/becas/mis-becas`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener tus becas' };
    }
  },

  // Obtener todas las convocatorias (para auxiliares ver todas)
  getAllConvocatorias: async () => {
    try {
      const response = await axios.get(`${API_URL}/becas?convocatorias=true`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener convocatorias' };
    }
  },

  // Obtener una beca por ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/becas/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener beca' };
    }
  },

  // Crear nueva beca
  create: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/becas`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear beca' };
    }
  },

  // Actualizar beca
update: async (id, formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/becas/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar beca' };
  }
},

  // Eliminar beca
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/becas/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar beca' };
    }
  },

  // Obtener estadísticas
  getEstadisticas: async () => {
    try {
      const response = await axios.get(`${API_URL}/becas/estadisticas`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener estadísticas' };
    }
  },

  // Obtener datos para gráficos
  getGraficos: async () => {
    try {
      const response = await axios.get(`${API_URL}/becas/graficos`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener gráficos' };
    }
  }
};

export default becaService;