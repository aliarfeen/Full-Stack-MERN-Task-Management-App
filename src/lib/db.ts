import mongoose from "mongoose";

export const connectdb = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () => console.log("db connected"));
    mongoose.connection.on("error", (err) => console.error("db error:", err));
    mongoose.connection.on("disconnected", () => console.warn("db disconnected"));

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    // Connect to MongoDB using the URI. Mongoose automatically handles database creation if specified in connection path.
    await mongoose.connect(mongoUri);
  } catch (e) {
    console.error("Database connection error:", e);
    process.exit(1);
  }
};
