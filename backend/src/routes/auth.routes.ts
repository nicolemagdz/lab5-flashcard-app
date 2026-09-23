import { Router } from "express";
import { z } from "zod";
import { login, register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export const authRouter = router;
