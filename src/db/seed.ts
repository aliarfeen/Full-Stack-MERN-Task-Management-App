import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectdb } from "../lib/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { UserRole, ProjectStatus, TaskStatus, TaskPriority } from "../types/index.js";

// Load environment variables
dotenv.config();

async function seedDatabase(): Promise<void> {
  console.log("Starting database seeding...");

  // Connect to DB
  await connectdb();

  try {
    // 1. Clear existing database entries
    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("Database cleared successfully.");

    // 2. Create seed users (Admin and Member)
    console.log("Creating seed users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const memberUser = await User.create({
      fullName: "Test Member",
      email: "testuser@example.com",
      password: hashedPassword,
      role: UserRole.MEMBER,
    });
    console.log(`Seeded Users: ${adminUser.fullName} (${adminUser.email} - ADMIN), ${memberUser.fullName} (${memberUser.email} - MEMBER)`);

    // 3. Create seed projects with owner and members
    console.log("Creating seed projects...");
    const project1 = await Project.create({
      owner: adminUser._id,
      members: [adminUser._id, memberUser._id],
      title: "Project Alpha",
      description: "This is the first sample project for task management.",
      status: ProjectStatus.IN_PROGRESS,
    });

    const project2 = await Project.create({
      owner: memberUser._id,
      members: [memberUser._id],
      title: "Project Beta",
      description: "Another sample project for verification.",
      status: ProjectStatus.PENDING,
    });
    console.log(`Seeded Projects: ${project1.title}, ${project2.title}`);

    // 4. Create seed tasks with creator and assignee
    console.log("Creating seed tasks...");
    const task1 = await Task.create({
      projectId: project1._id,
      title: "Design Database Schemas",
      description: "Define schemas for Users, Projects, and Tasks with validations.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      creator: adminUser._id,
      assignee: memberUser._id,
    });

    const task2 = await Task.create({
      projectId: project1._id,
      title: "Implement Auth Flow",
      description: "Create register/login endpoints with JWT and bcrypt.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MID,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      creator: adminUser._id,
      assignee: adminUser._id,
    });

    const task3 = await Task.create({
      projectId: project2._id,
      title: "Write System Documentation",
      description: "Create setup instructions and API routes map.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
      creator: memberUser._id,
      assignee: memberUser._id,
    });
    console.log(`Seeded Tasks: ${task1.title}, ${task2.title}, ${task3.title}`);

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seedDatabase();

