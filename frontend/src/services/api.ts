import axios from 'axios';
import { AuthResponse, User, Country, AIResponse, LoginData, RegisterData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  },
};

export const countryService = {
  async getCountry(): Promise<Country> {
    const response = await api.get('/country/');
    return response.data;
  },

  async processCommand(command: string): Promise<AIResponse> {
    const response = await api.post('/country/command', { command });
    return response.data;
  },

  async getDescription(): Promise<{ description: string }> {
    const response = await api.get('/country/description');
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get('/country/stats');
    return response.data;
  },
};

export default api;