import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Set process env before importing app
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key-12345";

import app from "../src/server.js";
import User from "../src/models/User.js";
import Project from "../src/models/Project.js";
import Task from "../src/models/Task.js";
import { UserRole, TaskStatus, TaskPriority } from "../src/types/index.js";

let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017/task_management_test";
  try {
    // Try connecting to local MongoDB server first
    await mongoose.connect(testDbUri, { serverSelectionTimeoutMS: 2000 });
  } catch (err) {
    // Fallback to MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }
}, 180000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});



beforeEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
});

describe("Task Management Backend API Tests", () => {

  // ─── 1. Authentication Tests ───────────────────────
  describe("1. Authentication", () => {
    it("should register a new user with default MEMBER role and return JWT token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "John Doe",
          email: "john@example.com",
          password: "password123",
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("john@example.com");
      expect(res.body.data.user.role).toBe(UserRole.MEMBER);
    });

    it("should login user with valid credentials and return token", async () => {
      // Register user first
      await request(app).post("/api/auth/register").send({
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "jane@example.com",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.token).toBeDefined();
    });

    it("should reject unauthenticated requests to protected routes", async () => {
      const res = await request(app).get("/api/project");
      expect(res.status).toBe(401);
      expect(res.body.message).toContain("Unauthorized");
    });
  });

  // ─── 2. Authorization & Roles ─────────────────────
  describe("2. Authorization & Role-Based Access Control", () => {
    it("should allow ADMIN to add/remove project members but forbid MEMBER", async () => {
      // Create Admin user
      const adminRegister = await request(app).post("/api/auth/register").send({
        fullName: "Admin User",
        email: "admin@example.com",
        password: "password123",
      });
      const adminToken = adminRegister.body.data.token;
      const adminId = adminRegister.body.data.user.id;
      // Elevate to ADMIN in DB
      await User.findByIdAndUpdate(adminId, { role: UserRole.ADMIN });

      // Create Member user 1 (project owner)
      const member1Register = await request(app).post("/api/auth/register").send({
        fullName: "Member One",
        email: "member1@example.com",
        password: "password123",
      });
      const member1Token = member1Register.body.data.token;

      // Create Member user 2 (to be added as project member)
      await request(app).post("/api/auth/register").send({
        fullName: "Member Two",
        email: "member2@example.com",
        password: "password123",
      });

      // Member 1 creates a project
      const projRes = await request(app)
        .post("/api/project")
        .set("Authorization", `Bearer ${member1Token}`)
        .send({ title: "Secret Project", description: "Admin test" });
      const projectId = projRes.body.data._id;

      // Member 1 (MEMBER role) attempts to add member 2 -> Should return 403 Forbidden
      const memberAddRes = await request(app)
        .post(`/api/project/${projectId}/members`)
        .set("Authorization", `Bearer ${member1Token}`)
        .send({ email: "member2@example.com" });
      expect(memberAddRes.status).toBe(403);

      // Admin user attempts to add member 2 -> Should succeed (200)
      const adminAddRes = await request(app)
        .post(`/api/project/${projectId}/members`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "member2@example.com" });
      expect(adminAddRes.status).toBe(200);
      expect(adminAddRes.body.data.members).toHaveLength(2);

      // Admin user removes member 2 -> Should succeed (200)
      const adminRemoveRes = await request(app)
        .delete(`/api/project/${projectId}/members`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "member2@example.com" });
      expect(adminRemoveRes.status).toBe(200);
    });
  });

  // ─── 3. Project Membership Authorization ───────────
  describe("3. Project Membership Authorization", () => {
    it("should allow users to view only projects they belong to", async () => {
      // User A
      const userAReg = await request(app).post("/api/auth/register").send({
        fullName: "User A",
        email: "usera@example.com",
        password: "password123",
      });
      const userAToken = userAReg.body.data.token;

      // User B
      const userBReg = await request(app).post("/api/auth/register").send({
        fullName: "User B",
        email: "userb@example.com",
        password: "password123",
      });
      const userBToken = userBReg.body.data.token;

      // User A creates Project A
      const projA = await request(app)
        .post("/api/project")
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ title: "Project A", description: "Owned by A" });

      // User B gets all projects -> Should be empty array
      const userBProjs = await request(app)
        .get("/api/project")
        .set("Authorization", `Bearer ${userBToken}`);
      expect(userBProjs.body.data).toHaveLength(0);

      // User B attempts to access Project A by ID -> Should return 404
      const userBGetProjA = await request(app)
        .get(`/api/project/${projA.body.data._id}`)
        .set("Authorization", `Bearer ${userBToken}`);
      expect(userBGetProjA.status).toBe(404);
    });
  });

  // ─── 4. Task CRUD Lifecycle ───────────────────────
  describe("4. Task CRUD Lifecycle", () => {
    it("should allow creating, reading, updating, and deleting tasks within accessible project", async () => {
      const userReg = await request(app).post("/api/auth/register").send({
        fullName: "Task Manager",
        email: "taskmanager@example.com",
        password: "password123",
      });
      const token = userReg.body.data.token;

      const projRes = await request(app)
        .post("/api/project")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task Test Project", description: "Testing task operations" });
      const projectId = projRes.body.data._id;

      // Create Task
      const createTaskRes = await request(app)
        .post(`/api/task/project/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Build Feature X",
          description: "Details for Feature X",
          priority: "HIGH",
          dueDate: "2026-12-31T23:59:59.000Z",
        });
      expect(createTaskRes.status).toBe(201);
      const taskId = createTaskRes.body.data._id;
      expect(createTaskRes.body.data.status).toBe(TaskStatus.TODO);
      expect(createTaskRes.body.data.creator).toBeDefined();

      // Read Task by ID
      const getTaskRes = await request(app)
        .get(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(getTaskRes.status).toBe(200);
      expect(getTaskRes.body.data.title).toBe("Build Feature X");

      // Update Task
      const updateTaskRes = await request(app)
        .put(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MID,
        });
      expect(updateTaskRes.status).toBe(200);
      expect(updateTaskRes.body.data.status).toBe(TaskStatus.IN_PROGRESS);

      // Delete Task
      const deleteTaskRes = await request(app)
        .delete(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(deleteTaskRes.status).toBe(204);

      // Verify deletion
      const getDeletedRes = await request(app)
        .get(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(getDeletedRes.status).toBe(404);
    });
  });

  // ─── 5. Task Filtering ─────────────────────────────
  describe("5. Task Query Filtering", () => {
    it("should filter tasks by status, priority, and assignee", async () => {
      const userReg = await request(app).post("/api/auth/register").send({
        fullName: "Filter Tester",
        email: "filter@example.com",
        password: "password123",
      });
      const token = userReg.body.data.token;
      const userId = userReg.body.data.user.id;

      const projRes = await request(app)
        .post("/api/project")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Filter Project", description: "Testing filters" });
      const projectId = projRes.body.data._id;

      // Create Task 1 (TODO, HIGH, assigned to userId)
      await request(app)
        .post(`/api/task/project/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Task 1",
          priority: "HIGH",
          dueDate: "2026-12-31T23:59:59.000Z",
          assignee: userId,
        });

      // Create Task 2 (IN_PROGRESS, LOW)
      await request(app)
        .post(`/api/task/project/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Task 2",
          status: "IN_PROGRESS",
          priority: "LOW",
          dueDate: "2026-12-31T23:59:59.000Z",
        });


      // Filter by status=TODO
      const statusRes = await request(app)
        .get(`/api/task/project/${projectId}?status=TODO`)
        .set("Authorization", `Bearer ${token}`);
      expect(statusRes.body.data).toHaveLength(1);
      expect(statusRes.body.data[0].title).toBe("Task 1");

      // Filter by priority=HIGH
      const priorityRes = await request(app)
        .get(`/api/task/project/${projectId}?priority=HIGH`)
        .set("Authorization", `Bearer ${token}`);
      expect(priorityRes.body.data).toHaveLength(1);
      expect(priorityRes.body.data[0].title).toBe("Task 1");

      // Filter by assignee=userId
      const assigneeRes = await request(app)
        .get(`/api/task/project/${projectId}?assignee=${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(assigneeRes.body.data).toHaveLength(1);
      expect(assigneeRes.body.data[0].title).toBe("Task 1");
    });
  });

  // ─── 6. Task Authorization ─────────────────────────
  describe("6. Task Access Authorization", () => {
    it("should prevent users from modifying or viewing tasks in inaccessible projects", async () => {
      const user1Reg = await request(app).post("/api/auth/register").send({
        fullName: "Owner User",
        email: "owner@example.com",
        password: "password123",
      });
      const user1Token = user1Reg.body.data.token;

      const user2Reg = await request(app).post("/api/auth/register").send({
        fullName: "Outside User",
        email: "outside@example.com",
        password: "password123",
      });
      const user2Token = user2Reg.body.data.token;

      const projRes = await request(app)
        .post("/api/project")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ title: "Private Project", description: "Private" });
      const projectId = projRes.body.data._id;

      const taskRes = await request(app)
        .post(`/api/task/project/${projectId}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          title: "Private Task",
          priority: "MID",
          dueDate: "2026-12-31T23:59:59.000Z",
        });
      const taskId = taskRes.body.data._id;

      // User 2 attempts to get project tasks -> 404
      const user2GetTasks = await request(app)
        .get(`/api/task/project/${projectId}`)
        .set("Authorization", `Bearer ${user2Token}`);
      expect(user2GetTasks.status).toBe(404);

      // User 2 attempts to update task -> 404
      const user2UpdateTask = await request(app)
        .put(`/api/task/${taskId}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ title: "Hacked Task" });
      expect(user2UpdateTask.status).toBe(404);
    });
  });

  // ─── 7. User Search ─────────────────────────────────
  describe("7. User Discovery / Search", () => {
    it("should search users by email partial query", async () => {
      const user1Reg = await request(app).post("/api/auth/register").send({
        fullName: "Alice Smith",
        email: "alice@company.com",
        password: "password123",
      });
      const token = user1Reg.body.data.token;

      await request(app).post("/api/auth/register").send({
        fullName: "Bob Jones",
        email: "bob@company.com",
        password: "password123",
      });

      const searchRes = await request(app)
        .get("/api/users/search?email=company")
        .set("Authorization", `Bearer ${token}`);

      expect(searchRes.status).toBe(200);
      expect(searchRes.body.results).toBe(2);
      expect(searchRes.body.data[0].password).toBeUndefined();
    });
  });
});
