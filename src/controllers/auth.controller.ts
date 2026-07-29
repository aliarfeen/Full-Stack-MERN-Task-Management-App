import { Request, Response, NextFunction } from "express";
import { AuthUseCase } from "../usecases/auth.useCase.js";
import { generateToken } from "../lib/utils.js";

const authUseCase = new AuthUseCase();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser = await authUseCase.registerUser(req.body);
    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await authUseCase.loginUser(email, password);
    const token = generateToken(user._id.toString());

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // With Bearer-only auth, logout is a client-side operation (discard the token).
    // This endpoint exists as a conventional acknowledgement.
    res.status(200).json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
