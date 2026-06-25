import User from "../../models/User.js";
import Project from "../../models/Project.js";
import Task from "../../models/Task.js";

export async function up(): Promise<void> {
  console.log("  >> Ensuring User indexes...");
  await User.syncIndexes();
  console.log("  >> Ensuring Project indexes...");
  await Project.syncIndexes();
  console.log("  >> Ensuring Task indexes...");
  await Task.syncIndexes();
  console.log("  >> All database indexes synchronized successfully.");
}

export async function down(): Promise<void> {
  console.log("  >> Down migration: dropping custom indexes (no-op).");
}
