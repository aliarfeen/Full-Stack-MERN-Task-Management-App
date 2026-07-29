import { z } from 'zod';
import { ProjectStatus } from '../types';

export const createProjectSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(1, 'Description is required'),
  status: z.nativeEnum(ProjectStatus).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().trim().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const addMemberSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
