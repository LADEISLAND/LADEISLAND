import axios from 'axios';
import { 
  User, 
  Country, 
  AuthResponse, 
  CommandRequest, 
  CommandResponse,
  LoginForm,
  RegisterForm,
  CountryCreateForm
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterForm): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginForm): Promise<AuthResponse> => {
    const response = await api.post('/auth/token', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Country API
export const countryAPI = {
  createCountry: async (data: CountryCreateForm): Promise<Country> => {
    const response = await api.post('/country/', data);
    return response.data;
  },

  getCountry: async (): Promise<Country> => {
    const response = await api.get('/country/');
    return response.data;
  },

  processCommand: async (command: string): Promise<CommandResponse> => {
    const response = await api.post('/country/command', { command });
    return response.data;
  },

  getHistory: async (): Promise<{ history: any[]; current_events: any[] }> => {
    const response = await api.get('/country/history');
    return response.data;
  },
};

export default api;