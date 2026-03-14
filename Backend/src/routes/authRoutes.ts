import express from "express";
import { registerCompany, loginUser, refreshToken, logoutUser } from "../controllers/authController";
import { googleLogin } from "../controllers/google.controller";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

export default router;