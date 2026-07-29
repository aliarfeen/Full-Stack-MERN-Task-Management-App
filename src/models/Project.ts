import mongoose from "mongoose";
import { IProject, ProjectStatus } from "../types/index.js";

const projectSchema = new mongoose.Schema<IProject>(
  { 
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    title: {
      type: String, 
      required: true,
      trim: true 
    },
    description: {
      type: String, 
      required: true,
      trim: true 
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PENDING,
      required: true,
    }
  },
  { timestamps: true }
);

// Indexes for efficient querying
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ members: 1 });

const Project = mongoose.model<IProject>("Project", projectSchema);
export default Project;