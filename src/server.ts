import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectdb } from "./lib/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// Security headers
app.use(helmet());

// Request logging
app.use(morgan("dev"));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "4mb" }));

// Rate limit auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 20,                   // 20 requests per window per IP
  message: { status: "fail", message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount API routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

// Health check endpoint
app.use("/api/status", (_req, res) => {
  res.json({ status: "success", message: "Task Management server is live" });
});

// Global error handler (must be registered after all routes)
app.use(errorHandler);

// Connect to MongoDB & start server
const startServer = async () => {
  await connectdb();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
};

startServer();
