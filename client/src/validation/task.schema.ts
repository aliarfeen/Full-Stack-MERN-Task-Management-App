import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../types';

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().min(1, 'Due date is required'),
  assignee: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().trim().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().optional(),
  assignee: z.string().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
