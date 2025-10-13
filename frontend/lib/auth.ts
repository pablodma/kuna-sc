import { api } from './api';

export interface User {
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  role: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export const authApi = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const user = authApi.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};






