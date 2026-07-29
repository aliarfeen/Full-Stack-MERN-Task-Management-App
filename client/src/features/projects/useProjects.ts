import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../api/projects.api';
import { CreateProjectInput, UpdateProjectInput } from '../../validation/project.schema';
import toast from 'react-hot-toast';

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectInput) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error?.message,
    refetch: projectsQuery.refetch,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
  };
}

export function useProjectDetail(projectId: string) {
  const queryClient = useQueryClient();

  const projectQuery = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId,
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: UpdateProjectInput) => projectsApi.update(projectId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['projects', projectId], updated);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () => projectsApi.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => projectsApi.addMember(projectId, email),
    onSuccess: (updated) => {
      queryClient.setQueryData(['projects', projectId], updated);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Member added to project');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add member');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (email: string) => projectsApi.removeMember(projectId, email),
    onSuccess: (updated) => {
      queryClient.setQueryData(['projects', projectId], updated);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Member removed from project');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isLoading,
    isError: projectQuery.isError,
    error: projectQuery.error?.message,
    refetch: projectQuery.refetch,

    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,

    deleteProject: deleteProjectMutation.mutate,
    isDeleting: deleteProjectMutation.isPending,

    addMember: addMemberMutation.mutate,
    isAddingMember: addMemberMutation.isPending,

    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
  };
}
