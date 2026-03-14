import express from "express";
import {
  createInterviewer,
  getInterviewers,
  updateInterviewer,
  deleteInterviewer,
  getProfile,
  updateProfile,
  getUserById
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Self profile management
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Only Admin can manage interviewers
router.post("/", protect, authorize("admin"), createInterviewer);
router.get("/", protect, authorize("admin"), getInterviewers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateInterviewer);
router.delete("/:id", protect, authorize("admin"), deleteInterviewer);

export default router;