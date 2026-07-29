import { apiClient } from './client';
import { ApiResponse, User } from '../types';
import { LoginInput, RegisterInput } from '../validation/auth.schema';

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout API call
    }
  },
};
