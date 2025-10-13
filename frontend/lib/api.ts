import axios from 'axios';
import { FinancingOfferRequest, SimulacionResponse, AjustesSistema, SettingsRequest } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const financingApi = {
  createSimulation: async (request: FinancingOfferRequest): Promise<SimulacionResponse> => {
    const response = await api.post('/api/financing-offers', request);
    return response.data;
  },
};

export const settingsApi = {
  getSettings: async (): Promise<AjustesSistema> => {
    const response = await api.get('/api/settings');
    return response.data;
  },
  
  updateSettings: async (request: SettingsRequest): Promise<AjustesSistema> => {
    const response = await api.patch('/api/settings', request);
    return response.data;
  },
};

export default api;