import { Types } from "mongoose";
import { ProjectRepository } from "../repositories/project.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { AppError } from "../lib/appError.js";
import { IProject, UserRole } from "../types/index.js";

export class ProjectUseCase {
  private projectRepo: ProjectRepository;
  private taskRepo: TaskRepository;
  private authRepo: AuthRepository;

  constructor() {
    this.projectRepo = new ProjectRepository();
    this.taskRepo = new TaskRepository();
    this.authRepo = new AuthRepository();
  }

  async createProject(title: string, description: string, userId: string): Promise<IProject> {
    const ownerId = new Types.ObjectId(userId);
    return await this.projectRepo.create({
      title,
      description,
      owner: ownerId,
      members: [ownerId],
    });
  }

  async getUserProjects(userId: string, userRole?: UserRole): Promise<IProject[]> {
    if (userRole === UserRole.ADMIN) {
      return await this.projectRepo.findAll();
    }
    return await this.projectRepo.findAllByMembership(userId);
  }

  private toIdString(entity: any): string {
    if (!entity) return "";
    if (typeof entity === "string") return entity;
    if (entity._id) return entity._id.toString();
    if (entity.id) return entity.id.toString();
    return entity.toString();
  }

  async getProjectById(id: string, userId: string, userRole?: UserRole): Promise<IProject> {
    const project = await this.projectRepo.findById(id);
    if (!project) {
      throw new AppError("Project not found or unauthorized access", 404);
    }

    const ownerIdStr = this.toIdString(project.owner);
    const reqIdStr = this.toIdString(userId);
    const isOwner = ownerIdStr === reqIdStr;
    const isMember = project.members.some((m: any) => this.toIdString(m) === reqIdStr);
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isMember && !isAdmin) {
      throw new AppError("Project not found or unauthorized access", 404);
    }

    return project;
  }

  async updateProject(id: string, userId: string, userRole: UserRole, updateData: Partial<IProject>): Promise<IProject> {
    await this.getProjectById(id, userId, userRole);

    const updatedProject = await this.projectRepo.update(id, updateData);
    if (!updatedProject) throw new AppError("Failed to update project", 500);

    return updatedProject;
  }

  async deleteProject(id: string, userId: string, userRole: UserRole): Promise<void> {
    await this.getProjectById(id, userId, userRole);
    // Cascade: delete all tasks belonging to this project
    await this.taskRepo.deleteAllByProjectId(id);
    await this.projectRepo.delete(id);
  }

  async addMember(projectId: string, targetEmail: string, requesterId: string, requesterRole: UserRole): Promise<IProject> {
    const project = await this.getProjectById(projectId, requesterId, requesterRole);

    const ownerIdStr = this.toIdString(project.owner);
    const reqIdStr = this.toIdString(requesterId);
    const isOwner = ownerIdStr === reqIdStr;
    const isAdmin = requesterRole === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new AppError("Only project owners or admins can manage project members", 403);
    }

    const targetUser = await this.authRepo.findUserByEmail(targetEmail);
    if (!targetUser) {
      throw new AppError("User with this email not found", 404);
    }

    const updatedProject = await this.projectRepo.addMember(projectId, targetUser._id.toString());
    if (!updatedProject) throw new AppError("Failed to add member to project", 500);

    return updatedProject;
  }

  async removeMember(projectId: string, targetEmail: string, requesterId: string, requesterRole: UserRole): Promise<IProject> {
    const project = await this.getProjectById(projectId, requesterId, requesterRole);

    const ownerIdStr = this.toIdString(project.owner);
    const reqIdStr = this.toIdString(requesterId);
    const isOwner = ownerIdStr === reqIdStr;
    const isAdmin = requesterRole === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new AppError("Only project owners or admins can manage project members", 403);
    }

    const targetUser = await this.authRepo.findUserByEmail(targetEmail);
    if (!targetUser) {
      throw new AppError("User with this email not found", 404);
    }

    if (ownerIdStr === this.toIdString(targetUser._id)) {
      throw new AppError("Cannot remove project owner from members", 400);
    }

    const updatedProject = await this.projectRepo.removeMember(projectId, targetUser._id.toString());
    if (!updatedProject) throw new AppError("Failed to remove member from project", 500);

    return updatedProject;
  }
}