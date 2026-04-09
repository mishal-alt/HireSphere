import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getAnalytics } from "../controllers/analyticsController";

const router = Router();

router.get("/", protect, adminOnly, getAnalytics);

export default router;
