import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { TaskUseCase } from "../usecases/task.useCase.js";
import { AppError } from "../lib/appError.js";

const taskUseCase = new TaskUseCase();

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId || !req.user) throw new AppError("Unauthorized", 401);

    const projectId = req.params.projectId as string;
    const task = await taskUseCase.createTask(projectId, userId, req.user.role, req.body);
    res.status(201).json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId || !req.user) throw new AppError("Unauthorized", 401);

    const projectId = req.params.projectId as string;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const assignee = req.query.assignee as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await taskUseCase.getProjectTasks(projectId, userId, req.user.role, {
      status,
      priority,
      assignee,
      page,
      limit,
    });

    res.status(200).json({
      status: "success",
      results: result.tasks.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId || !req.user) throw new AppError("Unauthorized", 401);

    const id = req.params.id as string;
    const task = await taskUseCase.getTaskById(id, userId, req.user.role);
    res.status(200).json({ status: "success", data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId || !req.user) throw new AppError("Unauthorized", 401);

    const id = req.params.id as string;
    const updatedTask = await taskUseCase.updateTask(id, userId, req.user.role, req.body);
    res.status(200).json({ status: "success", data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id.toString();
    if (!userId || !req.user) throw new AppError("Unauthorized", 401);

    const id = req.params.id as string;
    await taskUseCase.deleteTask(id, userId, req.user.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

