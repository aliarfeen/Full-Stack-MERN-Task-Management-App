import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectdb } from "../lib/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

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

    // 2. Create seed users
    console.log("Creating seed users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const testUser = await User.create({
      fullName: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
    });
    console.log(`Seeded User: ${testUser.fullName} (${testUser.email})`);

    // 3. Create seed projects
    console.log("Creating seed projects...");
    const project1 = await Project.create({
      userId: testUser._id,
      title: "Project Alpha",
      description: "This is the first sample project for task management.",
      status: "IN_PROGRESS",
    });

    const project2 = await Project.create({
      userId: testUser._id,
      title: "Project Beta",
      description: "Another sample project for verification.",
      status: "PENDING",
    });
    console.log(`Seeded Project: ${project1.title}, ${project2.title}`);

    // 4. Create seed tasks
    console.log("Creating seed tasks...");
    const task1 = await Task.create({
      projectId: project1._id,
      title: "Design Database Schemas",
      description: "Define schemas for Users, Projects, and Tasks with validations.",
      status: "DONE",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    });

    const task2 = await Task.create({
      projectId: project1._id,
      title: "Implement Auth Flow",
      description: "Create register/login endpoints with JWT and bcrypt.",
      status: "IN_PROGRESS",
      priority: "MID",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    });

    const task3 = await Task.create({
      projectId: project2._id,
      title: "Write System Documentation",
      description: "Create setup instructions and API routes map.",
      status: "PENDING",
      priority: "LOW",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
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
