import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validates.js";
import { loginSchema, registerSchema } from "../validators/auth.validation.js";

const router = express.Router();

// Applied validation middlewares here
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;