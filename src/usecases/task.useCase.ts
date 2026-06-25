import { Types } from "mongoose";
import { TaskRepository } from "../repositories/task.repository.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import { AppError } from "../lib/appError.js";
import { ITask } from "../types/index.js";

export class TaskUseCase {
  private taskRepo: TaskRepository;
  private projectRepo: ProjectRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
    this.projectRepo = new ProjectRepository();
  }

  async createTask(projectId: string, userId: string, taskData: Partial<ITask>): Promise<ITask> {
    const project = await this.projectRepo.findById(projectId);
    if (!project || project.userId.toString() !== userId) {
      throw new AppError("Project not found or unauthorized access", 404);
    }

    return await this.taskRepo.create({
      ...taskData,
      projectId: new Types.ObjectId(projectId),
    });
  }

  async getProjectTasks(
    projectId: string,
    userId: string,
    filter: { status?: string; priority?: string; page?: number; limit?: number }
  ): Promise<{ tasks: ITask[]; total: number; page: number; limit: number }> {
    const project = await this.projectRepo.findById(projectId);
    if (!project || project.userId.toString() !== userId) {
      throw new AppError("Project not found or unauthorized access", 404);
    }

    const { status, priority, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const queryFilter: { status?: string; priority?: string } = {};
    if (status) queryFilter.status = status;
    if (priority) queryFilter.priority = priority;

    const [tasks, total] = await Promise.all([
      this.taskRepo.findAllByProjectId(projectId, { ...queryFilter, skip, limit }),
      this.taskRepo.countByProjectId(projectId, queryFilter),
    ]);

    return { tasks, total, page, limit };
  }

  async getTaskById(id: string, userId: string): Promise<ITask> {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const project = await this.projectRepo.findById(task.projectId.toString());
    if (!project || project.userId.toString() !== userId) {
      throw new AppError("Task not found or unauthorized access", 404);
    }

    return task;
  }

  async updateTask(id: string, userId: string, updateData: Partial<ITask>): Promise<ITask> {
    // Check ownership before updating
    await this.getTaskById(id, userId);

    const updatedTask = await this.taskRepo.update(id, updateData);
    if (!updatedTask) {
      throw new AppError("Failed to update task", 500);
    }

    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    // Check ownership before deleting
    await this.getTaskById(id, userId);

    await this.taskRepo.delete(id);
  }
}
