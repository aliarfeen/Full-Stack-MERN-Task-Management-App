import User from "../../models/User.js";
import Project from "../../models/Project.js";
import Task from "../../models/Task.js";
import { UserRole, TaskStatus } from "../../types/index.js";

export async function up(): Promise<void> {
  console.log("  >> Running migration 002: updating User roles, Project ownership & members, Task status & fields...");

  // 1. Backfill User roles if missing
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: UserRole.MEMBER } }
  );

  // 2. Rename userId -> owner and populate members array on Projects if needed
  const rawProjects = await Project.collection.find({}).toArray();
  for (const p of rawProjects) {
    const updateDoc: any = {};
    if (p.userId && !p.owner) {
      updateDoc.owner = p.userId;
      updateDoc.members = [p.userId];
    } else if (p.owner && (!p.members || p.members.length === 0)) {
      updateDoc.members = [p.owner];
    }

    if (Object.keys(updateDoc).length > 0) {
      await Project.collection.updateOne(
        { _id: p._id },
        { $set: updateDoc, $unset: { userId: "" } }
      );
    }
  }

  // 3. Update Task statuses ("PENDING" -> "TODO") and backfill creator if missing
  const rawTasks = await Task.collection.find({}).toArray();
  for (const t of rawTasks) {
    const updateDoc: any = {};
    if (t.status === "PENDING") {
      updateDoc.status = TaskStatus.TODO;
    }

    if (!t.creator) {
      // Best effort: set creator to project owner
      const project = await Project.findById(t.projectId);
      if (project) {
        updateDoc.creator = project.owner;
      }
    }

    if (Object.keys(updateDoc).length > 0) {
      await Task.collection.updateOne(
        { _id: t._id },
        { $set: updateDoc }
      );
    }
  }

  // 4. Synchronize all collection indexes
  await User.syncIndexes();
  await Project.syncIndexes();
  await Task.syncIndexes();

  console.log("  >> Migration 002 completed successfully.");
}

export async function down(): Promise<void> {
  console.log("  >> Migration 002 down migration: no-op.");
}
