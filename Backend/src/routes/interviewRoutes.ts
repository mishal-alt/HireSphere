import express from "express";
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getInterviewerStats,
  getInterviewerInterviews,
  submitEvaluation,
} from "../controllers/interviewController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { validate } from "../middleware/validate";
import { createInterviewSchema, updateInterviewSchema } from "../validators/interview.validator";

const router = express.Router();

// Admin only
router.post("/", protect, authorize("admin"), validate(createInterviewSchema), createInterview);
router.get("/", protect, authorize("admin"), getInterviews);
router.get("/:id", protect, authorize("admin"), getInterviewById);
router.put("/:id", protect, authorize("admin"), validate(updateInterviewSchema), updateInterview);
router.delete("/:id", protect, authorize("admin"), deleteInterview);

// Interviewer specific
router.get("/interviewer/stats", protect, authorize("interviewer"), getInterviewerStats);
router.get("/interviewer/my-interviews", protect, authorize("interviewer"), getInterviewerInterviews);
router.post("/interviewer/submit-evaluation/:id", protect, authorize("interviewer"), submitEvaluation);

export default router;