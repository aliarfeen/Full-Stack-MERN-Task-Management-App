import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, TaskListResponse } from '../../api/tasks.api';
import { TaskFilters, TaskStatus } from '../../types';
import { CreateTaskInput, UpdateTaskInput } from '../../validation/task.schema';
import toast from 'react-hot-toast';

export function useTasks(projectId: string, filters?: TaskFilters) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery<TaskListResponse>({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => tasksApi.getProjectTasks(projectId, filters),
    enabled: !!projectId,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task created');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      toast.success('Task deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });

  return {
    tasks: tasksQuery.data?.tasks || [],
    total: tasksQuery.data?.total || 0,
    page: tasksQuery.data?.page || 1,
    limit: tasksQuery.data?.limit || 10,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error?.message,
    refetch: tasksQuery.refetch,

    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,

    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,

    updateStatus: updateStatusMutation.mutate,

    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,
  };
}
