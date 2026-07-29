import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { AppError } from "../lib/appError.js";

const authRepo = new AuthRepository();

export const searchUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const emailQuery = req.query.email as string;
    if (!emailQuery) {
      throw new AppError("Email query parameter is required", 400);
    }

    const users = await authRepo.searchByEmail(emailQuery);
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
