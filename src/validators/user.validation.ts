import { z } from "zod";

export const userSearchQuerySchema = z.object({
  query: z.object({
    email: z
      .string()
      .trim()
      .min(1, "Email query must not be empty"),
  }),
});
