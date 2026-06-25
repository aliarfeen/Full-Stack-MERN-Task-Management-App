import mongoose from "mongoose";
import { IProject } from "../types/index.js";

const projectSchema = new mongoose.Schema<IProject>(
  { 
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
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
      enum: ["PENDING","IN_PROGRESS","DONE"],
      default: "PENDING",
      required: true,
    }
  },
  { timestamps: true }
);

// Compound index for efficient user project queries
projectSchema.index({ userId: 1, createdAt: -1 });

const Project = mongoose.model<IProject>("Project", projectSchema);
export default Project;