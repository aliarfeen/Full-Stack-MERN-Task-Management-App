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

    // 2. Create seed users
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

    const secondMember = await User.create({
      fullName: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: UserRole.MEMBER,
    });

    const thirdMember = await User.create({
      fullName: "Sarah Connor",
      email: "sarah@example.com",
      password: hashedPassword,
      role: UserRole.MEMBER,
    });

    console.log(`\n=== Seeded User Credentials (Default Password: password123) ===`);
    console.log(`1. Admin User   : admin@example.com    (Role: ADMIN)`);
    console.log(`2. Test Member  : testuser@example.com (Role: MEMBER)`);
    console.log(`3. John Doe     : john@example.com     (Role: MEMBER)`);
    console.log(`4. Sarah Connor : sarah@example.com    (Role: MEMBER)\n`);

    // 3. Create seed projects with different owners and members
    console.log("Creating seed projects...");
    const project1 = await Project.create({
      owner: adminUser._id,
      members: [adminUser._id, memberUser._id, secondMember._id],
      title: "Website Redesign (Project Alpha)",
      description: "Revamp corporate website UI/UX with modern Tailwind styling and responsive components.",
      status: ProjectStatus.IN_PROGRESS,
    });

    const project2 = await Project.create({
      owner: memberUser._id,
      members: [memberUser._id, secondMember._id, thirdMember._id],
      title: "Mobile App MVP (Project Beta)",
      description: "Cross-platform mobile client built for field team task updates and push notifications.",
      status: ProjectStatus.IN_PROGRESS,
    });

    const project3 = await Project.create({
      owner: secondMember._id,
      members: [secondMember._id, adminUser._id],
      title: "DevOps & Infrastructure (Project Gamma)",
      description: "CI/CD pipelines, Docker containerization, and automated MongoDB backups setup.",
      status: ProjectStatus.PENDING,
    });

    const project4 = await Project.create({
      owner: thirdMember._id,
      members: [thirdMember._id, adminUser._id, memberUser._id],
      title: "Internal Analytics Dashboard (Project Delta)",
      description: "Real-time metrics, KPI visualization charts, and exportable weekly reports.",
      status: ProjectStatus.DONE,
    });

    console.log(`Seeded 4 Projects successfully.`);

    // 4. Create seed tasks across all projects
    console.log("Creating seed tasks...");
    const tasksData = [
      // Project 1 tasks
      {
        projectId: project1._id,
        title: "Design Figma Wireframes & Design System",
        description: "Define component library, color tokens, and layout guidelines for main views.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        creator: adminUser._id,
        assignee: memberUser._id,
      },
      {
        projectId: project1._id,
        title: "Implement Responsive Header & Sidebar Navigation",
        description: "Build adaptive navbar and sidebar drawer for desktop and mobile viewports.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MID,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
        creator: adminUser._id,
        assignee: secondMember._id,
      },
      {
        projectId: project1._id,
        title: "Setup Theme System & Color Tokens",
        description: "Create accessible color palettes and typography scale in CSS variables.",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        creator: adminUser._id,
        assignee: memberUser._id,
      },
      {
        projectId: project1._id,
        title: "Integrate Contact Form with Backend API",
        description: "Hook contact form submission to send email notification and persist submission in DB.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MID,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        creator: adminUser._id,
        assignee: adminUser._id,
      },

      // Project 2 tasks
      {
        projectId: project2._id,
        title: "User Authentication & JWT Storage",
        description: "Implement secure login screen, persistent token storage, and auth context hook.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        creator: memberUser._id,
        assignee: memberUser._id,
      },
      {
        projectId: project2._id,
        title: "Push Notifications Integration",
        description: "Configure Firebase Cloud Messaging for real-time task assignment alerts.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
        creator: memberUser._id,
        assignee: secondMember._id,
      },
      {
        projectId: project2._id,
        title: "Offline Data Caching & Sync Engine",
        description: "Cache local task edits when offline and sync updates automatically on reconnection.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MID,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
        creator: memberUser._id,
        assignee: thirdMember._id,
      },

      // Project 3 tasks
      {
        projectId: project3._id,
        title: "Docker Compose Setup for Multi-stage Builds",
        description: "Write Dockerfile and docker-compose.yml for backend server and MongoDB container.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        creator: secondMember._id,
        assignee: adminUser._id,
      },
      {
        projectId: project3._id,
        title: "Configure GitHub Actions CI/CD Workflow",
        description: "Automate automated vitest execution, lint checks, and staging deployment on push.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
        creator: secondMember._id,
        assignee: secondMember._id,
      },

      // Project 4 tasks
      {
        projectId: project4._id,
        title: "Define Key Business Metrics & Chart Schemas",
        description: "Specify aggregate pipeline queries for daily active users and project velocity.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        creator: thirdMember._id,
        assignee: thirdMember._id,
      },
      {
        projectId: project4._id,
        title: "Export Reports to PDF & CSV Feature",
        description: "Generate downloadable PDF executive summaries and CSV data dumps.",
        status: TaskStatus.DONE,
        priority: TaskPriority.MID,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        creator: thirdMember._id,
        assignee: memberUser._id,
      },
    ];

    await Task.insertMany(tasksData);
    console.log(`Seeded ${tasksData.length} Tasks successfully.`);

    console.log("\nDatabase seeding completed successfully.");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seedDatabase();
