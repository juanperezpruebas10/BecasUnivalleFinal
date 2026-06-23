import axios from 'axios';
import API_URL from '../config/api';

const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const premioService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/premios-internacionales`, getAuthHeader());
    return res.data;
  },
  create: async (formData) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${API_URL}/premios-internacionales`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id, formData) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API_URL}/premios-internacionales/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await axios.delete(`${API_URL}/premios-internacionales/${id}`, getAuthHeader());
    return res.data;
  },
  getEstadisticas: async () => {
    const res = await axios.get(`${API_URL}/premios-internacionales/estadisticas`, getAuthHeader());
    return res.data;
  }
};

export default premioService;
