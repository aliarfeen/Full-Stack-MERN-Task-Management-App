import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { validate } from "../middleware/validates.js";
import { 
  createProjectSchema, 
  projectParamsSchema, 
  updateProjectSchema 
} from "../validators/project.validation.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "../controllers/project.controller.js";

const router = express.Router();

// Apply auth protection globally to all project resource endpoints
router.use(protectRoutes);

router.route("/")
  .post(validate(createProjectSchema), createProject)
  .get(getAllProjects);

router.route("/:id")
  .get(validate(projectParamsSchema), getProjectById)
  .put(validate(updateProjectSchema), updateProject)
  .delete(validate(projectParamsSchema), deleteProject);

export default router;