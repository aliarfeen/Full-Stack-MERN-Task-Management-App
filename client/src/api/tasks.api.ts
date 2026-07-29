import { apiClient } from './client';
import { ApiResponse, Task, TaskFilters } from '../types';
import { CreateTaskInput, UpdateTaskInput } from '../validation/task.schema';

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export const tasksApi = {
  getProjectTasks: async (projectId: string, filters?: TaskFilters): Promise<TaskListResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignee) params.append('assignee', filters.assignee);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/task/project/${projectId}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ApiResponse<Task[]>>(url);
    return {
      tasks: response.data.data || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      limit: response.data.limit || 10,
    };
  },

  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/task/${id}`);
    if (!response.data.data) {
      throw new Error('Task not found');
    }
    return response.data.data;
  },

  create: async (projectId: string, data: CreateTaskInput): Promise<Task> => {
    // Format ISO string for date field
    const payload = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    };
    const response = await apiClient.post<ApiResponse<Task>>(`/task/project/${projectId}`, payload);
    if (!response.data.data) {
      throw new Error('Failed to create task');
    }
    return response.data.data;
  },

  update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const payload: any = { ...data };
    if (data.dueDate) {
      payload.dueDate = new Date(data.dueDate).toISOString();
    }
    const response = await apiClient.put<ApiResponse<Task>>(`/task/${id}`, payload);
    if (!response.data.data) {
      throw new Error('Failed to update task');
    }
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/task/${id}`);
  },
};
