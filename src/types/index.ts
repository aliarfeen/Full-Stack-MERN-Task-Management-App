import { Document, Types } from "mongoose";
import { Request } from "express";

// ─── Enums ──────────────────────────────────────────
export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum ProjectStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MID = "MID",
  HIGH = "HIGH",
}

// ─── User ────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Project ────────────────────────────────────────
export interface IProject extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  title: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Task ───────────────────────────────────────────
export interface ITask extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  creator: Types.ObjectId;
  assignee?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Auth Request (after middleware) ─────────────
export interface AuthRequest extends Request {
  user?: IUser;
}

