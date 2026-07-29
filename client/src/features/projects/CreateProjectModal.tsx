import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, CreateProjectInput } from '../../validation/project.schema';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectInput) => void;
  isLoading: boolean;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleFormSubmit = (data: CreateProjectInput) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" description="Add a new project to start managing tasks with your team.">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
        <Input
          label="Project Title"
          placeholder="Website Redesign"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="w-full space-y-1">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief overview of project goals..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400"
            {...register('description')}
          />
          {errors.description?.message && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
