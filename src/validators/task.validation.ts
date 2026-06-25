import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const TaskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
const TaskPriorityEnum = z.enum(["LOW", "MID", "HIGH"]);

export const taskParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const projectTasksParamsSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
});

export const createTaskSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long"),
    description: z.string().trim().optional(),
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum,
    dueDate: z
      .string()
      .datetime() // Let it throw its default message to avoid the configuration overload trap
      .transform((val) => new Date(val)),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long").optional(),
    description: z.string().trim().optional(),
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum.optional(),
    dueDate: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
  }).refine(
    (data) => Object.keys(data).length > 0, 
    "At least one field must be provided for update"
  ),
});

export const taskFilterQuerySchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  query: z.object({
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum.optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});