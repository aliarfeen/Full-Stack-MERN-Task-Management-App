import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "../types/index.js";
import { AppError } from "../lib/appError.js";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Unauthorized — user not authenticated", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden — insufficient permissions", 403));
    }

    next();
  };
};
