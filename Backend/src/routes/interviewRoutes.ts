import express from "express";
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getInterviewerStats,
  getInterviewerInterviews,
} from "../controllers/interviewController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Admin only
router.post("/", protect, authorize("admin"), createInterview);
router.get("/", protect, authorize("admin"), getInterviews);
router.get("/:id", protect, authorize("admin"), getInterviewById);
router.put("/:id", protect, authorize("admin"), updateInterview);
router.delete("/:id", protect, authorize("admin"), deleteInterview);

// Interviewer specific
router.get("/interviewer/stats", protect, authorize("interviewer"), getInterviewerStats);
router.get("/interviewer/my-interviews", protect, authorize("interviewer"), getInterviewerInterviews);

export default router;