import { apiClient } from './client';
import { ApiResponse, User } from '../types';

export const usersApi = {
  searchByEmail: async (email: string): Promise<User[]> => {
    if (!email || email.trim().length === 0) return [];
    const response = await apiClient.get<ApiResponse<User[]>>(`/users/search?email=${encodeURIComponent(email)}`);
    return response.data.data || [];
  },
};
