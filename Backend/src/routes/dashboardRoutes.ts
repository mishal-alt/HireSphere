import express from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getDashboardStats);

export default router;
