import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/appError.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors (thrown via AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode < 500 ? "fail" : "error",
      message: err.message,
    });
    return;
  }

  // Zod validation errors (check by name for Zod v4 compatibility)
  if (err.name === "ZodError" && "issues" in err) {
    const issues = (err as any).issues as Array<{ path: (string | number)[]; message: string }>;
    res.status(400).json({
      status: "fail",
      message: "Validation error",
      errors: issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Mongoose CastError (invalid ObjectId format)
  if (err.name === "CastError") {
    res.status(400).json({
      status: "fail",
      message: "Invalid ID format",
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    res.status(409).json({
      status: "fail",
      message: "Duplicate field value",
    });
    return;
  }

  // Unexpected errors — log and hide details in production
  console.error("Unhandled error:", err);

  const isDev = process.env.NODE_ENV === "development";
  res.status(500).json({
    status: "error",
    message: isDev ? err.message : "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
};
