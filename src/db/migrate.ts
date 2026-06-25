import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectdb } from "../lib/db.js";
import Migration from "./migrationModel.js";
import * as migration001 from "./migrations/001_ensure_indexes.js";

// Load environment variables
dotenv.config();

const migrations = [
  { name: "001_ensure_indexes", up: migration001.up, down: migration001.down },
];

async function runMigrations(): Promise<void> {
  console.log("Starting database migrations...");
  
  // Connect to DB
  await connectdb();

  try {
    // Run migrations sequentially
    for (const m of migrations) {
      const alreadyExecuted = await Migration.findOne({ name: m.name });
      if (alreadyExecuted) {
        console.log(`Migration "${m.name}" is already executed. Skipping.`);
        continue;
      }

      console.log(`Running migration "${m.name}"...`);
      await m.up();

      // Record in migration tracking collection
      await Migration.create({ name: m.name });
      console.log(`Migration "${m.name}" completed successfully.`);
    }

    console.log("All migrations run successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

runMigrations();
