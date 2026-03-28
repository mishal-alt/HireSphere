import express from "express";
import { registerCompany, loginUser, refreshToken, logoutUser } from "../controllers/authController";
import { googleLogin } from "../controllers/google.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { signupSchema, loginSchema } from "../validators/auth.validator";

const router = express.Router();

router.post("/register", validate(signupSchema), asyncHandler(registerCompany));
router.post("/login", validate(loginSchema), asyncHandler(loginUser));
router.post("/google", asyncHandler(googleLogin));
router.post("/refresh-token", asyncHandler(refreshToken));
router.post("/logout", logoutUser);

export default router;