import mongoose from "mongoose";
import { ITask, TaskPriority, TaskStatus } from "../types/index.js";

const taskSchema = new mongoose.Schema<ITask>(
  {
    projectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project",
      required: true 
    },
    title: {
      type: String, 
      required: true,
      trim: true 
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.LOW,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

// Indexes for efficient querying
taskSchema.index({ projectId: 1, createdAt: -1 });
taskSchema.index({ assignee: 1 });

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;