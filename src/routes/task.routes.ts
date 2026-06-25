import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { validate } from "../middleware/validates.js";
import {
  createTaskSchema,
  taskParamsSchema,
  updateTaskSchema,
  taskFilterQuerySchema,
} from "../validators/task.validation.js";
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Apply auth protection globally to all task endpoints
router.use(protectRoutes);

// Project-specific task endpoints
router.route("/project/:projectId")
  .post(validate(createTaskSchema), createTask)
  .get(validate(taskFilterQuerySchema), getProjectTasks);

// Specific task endpoints by ID
router.route("/:id")
  .get(validate(taskParamsSchema), getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(validate(taskParamsSchema), deleteTask);

export default router;
