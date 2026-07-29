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

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  owner: User;
  members: User[];
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  creator: User;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  status: "success" | "fail" | "error";
  message?: string;
  data?: T;
  results?: number;
  total?: number;
  page?: number;
  limit?: number;
  errors?: Array<{ field: string; message: string }>;
}

export interface TaskFilters {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  assignee?: string | "";
  page?: number;
  limit?: number;
}
