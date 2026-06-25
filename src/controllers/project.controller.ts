import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { ProjectUseCase } from "../usecases/project.useCase.js";
import { AppError } from "../lib/appError.js";

const projectUseCase = new ProjectUseCase();

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) throw new AppError("Unauthorized", 401);

    const { title, description } = req.body;
    const project = await projectUseCase.createProject(title, description, userId);
    res.status(201).json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) throw new AppError("Unauthorized", 401);

    const projects = await projectUseCase.getUserProjects(userId);
    res.status(200).json({ status: "success", results: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) throw new AppError("Unauthorized", 401);

    const id = req.params.id as string;
    const project = await projectUseCase.getProjectById(id, userId);
    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) throw new AppError("Unauthorized", 401);

    const id = req.params.id as string;
    const updatedProject = await projectUseCase.updateProject(id, userId, req.body);
    res.status(200).json({ status: "success", data: updatedProject });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) throw new AppError("Unauthorized", 401);

    const id = req.params.id as string;
    await projectUseCase.deleteProject(id, userId);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    next(error);
  }
};