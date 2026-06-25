import mongoose from "mongoose";
import { ITask } from "../types/index.js";

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
      enum: ["PENDING","IN_PROGRESS","DONE"],
      default: "PENDING",
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW","MID","HIGH"],
      default: "LOW",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Compound index for efficient project task queries
taskSchema.index({ projectId: 1, createdAt: -1 });

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;