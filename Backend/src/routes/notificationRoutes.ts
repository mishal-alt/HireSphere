import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

export default router;
