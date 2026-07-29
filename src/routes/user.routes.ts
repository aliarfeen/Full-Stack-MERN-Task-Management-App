import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { validate } from "../middleware/validates.js";
import { userSearchQuerySchema } from "../validators/user.validation.js";
import { searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/search", validate(userSearchQuerySchema), searchUsers);

export default router;
