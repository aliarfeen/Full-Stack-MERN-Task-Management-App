import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validates body, query, and params simultaneously
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated & sanitized output.
      // This ensures only schema-defined fields pass through (strips unknown keys like userId overrides).
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) Object.assign(req.query, parsed.query);
      if (parsed.params) Object.assign(req.params, parsed.params);

      next();
    } catch (error) {
      // Delegate to global error handler (handles ZodError formatting)
      next(error);
    }
  };
};