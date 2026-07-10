import axios from 'axios';
import API_URL from '../config/api';

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1 hora
let inactivityTimer = null;

// Decodifica el payload de un JWT sin necesitar librerías externas
const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

// Revisa si el token ya expiró (campo "exp" viene en segundos desde epoch)
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const nowInSeconds = Date.now() / 1000;
  return decoded.exp < nowInSeconds;
};

const forceLogoutRedirect = () => {
  authService.logout();
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

// Reinicia el contador de inactividad cada vez que el usuario interactúa
const resetInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (!authService.isAuthenticated()) return;

  inactivityTimer = setTimeout(() => {
    console.log('Sesión cerrada por inactividad (1 hora sin actividad)');
    forceLogoutRedirect();
  }, INACTIVITY_LIMIT_MS);
};

// Escucha actividad del usuario para reiniciar el contador
const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
activityEvents.forEach((evt) => {
  window.addEventListener(evt, resetInactivityTimer, { passive: true });
});

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        resetInactivityTimer();
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Obtener perfil
  getProfile: async () => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('No token');

    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Logout
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    if (inactivityTimer) clearTimeout(inactivityTimer);
  },

  // Obtener usuario actual (si el token expiró, cierra sesión y devuelve null)
  getCurrentUser: () => {
    const token = sessionStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      authService.logout();
      return null;
    }
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Verificar si está autenticado (token existe Y no ha expirado)
  isAuthenticated: () => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    if (isTokenExpired(token)) {
      authService.logout();
      return false;
    }
    return true;
  }
};

// Al cargar la app, si ya hay una sesión activa (por ejemplo, tras recargar
// la página sin cerrar la pestaña), arrancamos el contador de inactividad.
resetInactivityTimer();

// Interceptor global: si el backend responde 401 en cualquier request
// (token vencido o inválido), cerramos sesión y mandamos al login.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      forceLogoutRedirect();
    }
    return Promise.reject(error);
  }
);

export default authService;
