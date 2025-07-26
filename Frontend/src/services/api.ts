import axios from 'axios';
import { LoginRequest, AuthResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  signup: async (userData: Omit<User, 'id'> & { password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  signin: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', loginData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('jwt');
  },

  getToken: (): string | null => {
    return localStorage.getItem('jwt');
  },

  setToken: (token: string): void => {
    localStorage.setItem('jwt', token);
  }
};

export default api;
