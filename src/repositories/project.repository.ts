import { IProject } from "../types/index.js";
import Project from "../models/Project.js";

export class ProjectRepository {
  async create(projectData: Partial<IProject>): Promise<IProject> {
    const created = await Project.create(projectData);
    const populated = await this.findById(created._id.toString());
    return populated || created;
  }

  async findAllByMembership(userId: string): Promise<IProject[]> {
    return await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "fullName email role")
      .populate("members", "fullName email role")
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProject | null> {
    return await Project.findById(id)
      .populate("owner", "fullName email role")
      .populate("members", "fullName email role");
  }

  async update(id: string, updateData: Partial<IProject>): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "fullName email role")
      .populate("members", "fullName email role");
  }

  async delete(id: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(id);
  }

  async addMember(projectId: string, userId: string): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: userId } },
      { new: true }
    )
      .populate("owner", "fullName email role")
      .populate("members", "fullName email role");
  }

  async removeMember(projectId: string, userId: string): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: userId } },
      { new: true }
    )
      .populate("owner", "fullName email role")
      .populate("members", "fullName email role");
  }
}