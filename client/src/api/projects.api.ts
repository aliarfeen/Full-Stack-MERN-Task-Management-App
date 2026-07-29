import { apiClient } from './client';
import { ApiResponse, Project } from '../types';
import { CreateProjectInput, UpdateProjectInput } from '../validation/project.schema';

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/project');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/project/${id}`);
    if (!response.data.data) {
      throw new Error('Project not found');
    }
    return response.data.data;
  },

  create: async (data: CreateProjectInput): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>('/project', data);
    if (!response.data.data) {
      throw new Error('Failed to create project');
    }
    return response.data.data;
  },

  update: async (id: string, data: UpdateProjectInput): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/project/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update project');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/project/${id}`);
  },

  addMember: async (projectId: string, email: string): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(`/project/${projectId}/members`, { email });
    if (!response.data.data) {
      throw new Error('Failed to add member');
    }
    return response.data.data;
  },

  removeMember: async (projectId: string, email: string): Promise<Project> => {
    const response = await apiClient.delete<ApiResponse<Project>>(`/project/${projectId}/members`, {
      data: { email },
    });
    if (!response.data.data) {
      throw new Error('Failed to remove member');
    }
    return response.data.data;
  },
};
