import { IProject } from "../types/index.js";
import Project from "../models/Project.js";

export class ProjectRepository {
  async create(projectData: Partial<IProject>): Promise<IProject> {
    return await Project.create(projectData);
  }

  async findAllByUserId(userId: string): Promise<IProject[]> {
    return await Project.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProject | null> {
    return await Project.findById(id);
  }

  async update(id: string, updateData: Partial<IProject>): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(id);
  }
}