import { Document, Types } from "mongoose";
import { Request } from "express";

// ─── User ────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
// ─── Project ────────────────────────────────────────
export interface IProject extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  status: "PENDING"|"IN_PROGRESS"|"DONE";
  createdAt: Date;
  updatedAt: Date;
}

// ─── Task ───────────────────────────────────────────
export interface ITask extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: "PENDING"|"IN_PROGRESS"|"DONE";
  priority: "LOW"|"MID"|"HIGH";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Auth Request (after middleware) ─────────────
export interface AuthRequest extends Request {
  user?: IUser;
}
