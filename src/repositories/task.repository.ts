import { ITask } from "../types/index.js";
import Task from "../models/Task.js";

export class TaskRepository {
  async create(taskData: Partial<ITask>): Promise<ITask> {
    return await Task.create(taskData);
  }

  async findAllByProjectId(
    projectId: string,
    filter: { status?: string; priority?: string; assignee?: string; skip?: number; limit?: number }
  ): Promise<ITask[]> {
    const query: any = { projectId };
    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.assignee) query.assignee = filter.assignee;

    const queryBuilder = Task.find(query).sort({ createdAt: -1 });

    if (filter.skip !== undefined) queryBuilder.skip(filter.skip);
    if (filter.limit !== undefined) queryBuilder.limit(filter.limit);

    return await queryBuilder;
  }

  async countByProjectId(
    projectId: string,
    filter: { status?: string; priority?: string; assignee?: string }
  ): Promise<number> {
    const query: any = { projectId };
    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.assignee) query.assignee = filter.assignee;

    return await Task.countDocuments(query);
  }


  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id);
  }

  async update(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id);
  }

  async deleteAllByProjectId(projectId: string): Promise<void> {
    await Task.deleteMany({ projectId });
  }
}
