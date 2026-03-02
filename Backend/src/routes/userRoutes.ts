import express from "express";
import {
  createInterviewer,
  getInterviewers,
  updateInterviewer,
  deleteInterviewer,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Only Admin can manage interviewers
router.post("/", protect, authorize("admin"), createInterviewer);
router.get("/", protect, authorize("admin"), getInterviewers);
router.put("/:id", protect, authorize("admin"), updateInterviewer);
router.delete("/:id", protect, authorize("admin"), deleteInterviewer);

export default router;