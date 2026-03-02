import express from "express";
import { registerCompany, loginUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginUser);

export default router;