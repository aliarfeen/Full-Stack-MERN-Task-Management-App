import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProjectSchema, UpdateProjectInput } from '../../validation/project.schema';
import { Project, ProjectStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSubmit: (data: UpdateProjectInput) => void;
  isLoading: boolean;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        status: project.status,
      });
    }
  }, [project, reset]);

  const handleFormSubmit = (data: UpdateProjectInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Project Settings">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
        <Input
          label="Project Title"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="w-full space-y-1">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            {...register('description')}
          />
        </div>

        <div className="w-full space-y-1">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Project Status
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            {...register('status')}
          >
            <option value={ProjectStatus.PENDING}>PENDING</option>
            <option value={ProjectStatus.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={ProjectStatus.DONE}>DONE</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
