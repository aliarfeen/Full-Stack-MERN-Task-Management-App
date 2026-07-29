import { Types } from "mongoose";
import { TaskRepository } from "../repositories/task.repository.js";
import { ProjectRepository } from "../repositories/project.repository.js";
import { AppError } from "../lib/appError.js";
import { ITask, UserRole } from "../types/index.js";

export class TaskUseCase {
  private taskRepo: TaskRepository;
  private projectRepo: ProjectRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
    this.projectRepo = new ProjectRepository();
  }

  private checkProjectAccess(project: any, userId: string, userRole?: UserRole): void {
    if (!project) {
      throw new AppError("Project not found or unauthorized access", 404);
    }

    const ownerIdStr = project.owner._id ? project.owner._id.toString() : project.owner.toString();
    const isOwner = ownerIdStr === userId;
    const isMember = project.members.some((m: any) => {
      const mId = m._id ? m._id.toString() : m.toString();
      return mId === userId;
    });
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isMember && !isAdmin) {
      throw new AppError("Project not found or unauthorized access", 404);
    }
  }

  async createTask(projectId: string, userId: string, userRole: UserRole, taskData: Partial<ITask>): Promise<ITask> {
    const project = await this.projectRepo.findById(projectId);
    this.checkProjectAccess(project, userId, userRole);

    if (taskData.assignee) {
      const assigneeStr = taskData.assignee.toString();
      const ownerIdStr = project!.owner._id ? project!.owner._id.toString() : project!.owner.toString();
      const isAssigneeMember =
        project!.members.some((m: any) => (m._id ? m._id.toString() : m.toString()) === assigneeStr) ||
        ownerIdStr === assigneeStr;
      if (!isAssigneeMember) {
        throw new AppError("Assignee must be a member or owner of the project", 400);
      }
    }

    return await this.taskRepo.create({
      ...taskData,
      projectId: new Types.ObjectId(projectId),
      creator: new Types.ObjectId(userId),
    });
  }

  async getProjectTasks(
    projectId: string,
    userId: string,
    userRole: UserRole,
    filter: { status?: string; priority?: string; assignee?: string; page?: number; limit?: number }
  ): Promise<{ tasks: ITask[]; total: number; page: number; limit: number }> {
    const project = await this.projectRepo.findById(projectId);
    this.checkProjectAccess(project, userId, userRole);

    const { status, priority, assignee, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const queryFilter: { status?: string; priority?: string; assignee?: string } = {};
    if (status) queryFilter.status = status;
    if (priority) queryFilter.priority = priority;
    if (assignee) queryFilter.assignee = assignee;

    const [tasks, total] = await Promise.all([
      this.taskRepo.findAllByProjectId(projectId, { ...queryFilter, skip, limit }),
      this.taskRepo.countByProjectId(projectId, queryFilter),
    ]);

    return { tasks, total, page, limit };
  }

  async getTaskById(id: string, userId: string, userRole?: UserRole): Promise<ITask> {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const project = await this.projectRepo.findById(task.projectId.toString());
    this.checkProjectAccess(project, userId, userRole);

    return task;
  }

  async updateTask(id: string, userId: string, userRole: UserRole, updateData: Partial<ITask>): Promise<ITask> {
    const task = await this.getTaskById(id, userId, userRole);

    if (updateData.assignee) {
      const project = await this.projectRepo.findById(task.projectId.toString());
      const assigneeStr = updateData.assignee.toString();
      const ownerIdStr = project!.owner._id ? project!.owner._id.toString() : project!.owner.toString();
      const isAssigneeMember =
        project!.members.some((m: any) => (m._id ? m._id.toString() : m.toString()) === assigneeStr) ||
        ownerIdStr === assigneeStr;
      if (!isAssigneeMember) {
        throw new AppError("Assignee must be a member or owner of the project", 400);
      }
    }

    const updatedTask = await this.taskRepo.update(id, updateData);
    if (!updatedTask) {
      throw new AppError("Failed to update task", 500);
    }

    return updatedTask;
  }

  async deleteTask(id: string, userId: string, userRole: UserRole): Promise<void> {
    await this.getTaskById(id, userId, userRole);

    await this.taskRepo.delete(id);
  }
}
