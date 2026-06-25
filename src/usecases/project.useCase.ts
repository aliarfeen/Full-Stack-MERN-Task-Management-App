import { Types } from "mongoose";
import { ProjectRepository } from "../repositories/project.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";
import { AppError } from "../lib/appError.js";
import { IProject } from "../types/index.js";

export class ProjectUseCase {
  private projectRepo: ProjectRepository;
  private taskRepo: TaskRepository;

  constructor() {
    this.projectRepo = new ProjectRepository();
    this.taskRepo = new TaskRepository();
  }

  async createProject(title: string, description: string, userId: string): Promise<IProject> {
    return await this.projectRepo.create({ title, description, userId: new Types.ObjectId(userId) });
  }

  async getUserProjects(userId: string): Promise<IProject[]> {
    return await this.projectRepo.findAllByUserId(userId);
  }

  async getProjectById(id: string, userId: string): Promise<IProject> {
    const project = await this.projectRepo.findById(id);
    if (!project || project.userId.toString() !== userId) {
      throw new AppError("Project not found or unauthorized access", 404);
    }
    return project;
  }

  async updateProject(id: string, userId: string, updateData: Partial<IProject>): Promise<IProject> {
    // Enforce ownership check before updating
    await this.getProjectById(id, userId);
    
    const updatedProject = await this.projectRepo.update(id, updateData);
    if (!updatedProject) throw new AppError("Failed to update project", 500);
    
    return updatedProject;
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    // Enforce ownership check before deleting
    await this.getProjectById(id, userId);
    // Cascade: delete all tasks belonging to this project
    await this.taskRepo.deleteAllByProjectId(id);
    await this.projectRepo.delete(id);
  }
}