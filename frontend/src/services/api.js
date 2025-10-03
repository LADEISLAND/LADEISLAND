import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updatePreferences: (preferences) => api.put('/auth/preferences', { preferences }),
  verifyToken: () => api.get('/auth/verify'),
};

// Chat API
export const chatAPI = {
  sendMessage: (messageData) => api.post('/chat/send', messageData),
  getHistory: (sessionId, limit = 50, offset = 0) => 
    api.get(`/chat/history/${sessionId}?limit=${limit}&offset=${offset}`),
  getPlanetInfo: (planetName) => api.get(`/chat/planet/${planetName}`),
  getSessions: () => api.get('/chat/sessions'),
  clearSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
};

// Solar System API
export const solarSystemAPI = {
  getDefault: () => api.get('/solar-system/default'),
  getById: (id) => api.get(`/solar-system/${id}`),
  create: (data) => api.post('/solar-system', data),
  update: (id, data) => api.put(`/solar-system/${id}`, data),
  getPlanet: (planetName) => api.get(`/solar-system/planet/${planetName}`),
  getPlanetsList: () => api.get('/solar-system/planets/list'),
  getStats: () => api.get('/solar-system/stats/overview'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;