import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const ProjectStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);

export const projectParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long"),
    description: z
      .string()
      .trim(),
    status: ProjectStatusEnum.optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long").optional(),
    description: z.string().trim().optional(),
    status: ProjectStatusEnum.optional(),
  }).refine(
    (data) => Object.keys(data).length > 0, 
    "At least one field must be provided for update"
  ),
});