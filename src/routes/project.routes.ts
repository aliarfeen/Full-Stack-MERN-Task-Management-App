import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validates.js";
import { UserRole } from "../types/index.js";
import { 
  createProjectSchema, 
  projectParamsSchema, 
  updateProjectSchema,
  addMemberSchema,
  removeMemberSchema,
} from "../validators/project.validation.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
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

// Member management (Project Owner or Admin)
router.route("/:id/members")
  .post(validate(addMemberSchema), addMember)
  .delete(validate(removeMemberSchema), removeMember);

export default router;