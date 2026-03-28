import express from "express";
import {
  createInterviewer,
  getInterviewers,
  updateInterviewer,
  deleteInterviewer,
  getProfile,
  updateProfile,
  getUserById,
  getAllParticipants,
  uploadImage,
  changePassword
} from "../controllers/userController";
import { asyncHandler } from "../middleware/asyncHandler";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { validate } from "../middleware/validate";
import { uploadProfileImage } from "../middleware/uploadMiddleware";
import { createInterviewerSchema, updateInterviewerSchema } from "../validators/interviewer.validator";

const router = express.Router();

// Self profile management
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/profile/image", protect, uploadProfileImage.single('image'), uploadImage);
router.put("/change-password", protect, asyncHandler(changePassword));


// Chat participant discovery for everyone in company
router.get("/chat-participants", protect, getAllParticipants);

// Only Admin can manage interviewers
router.post("/", protect, authorize("admin"), validate(createInterviewerSchema), createInterviewer);
router.get("/", protect, authorize("admin"), getInterviewers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), validate(updateInterviewerSchema), updateInterviewer);
router.delete("/:id", protect, authorize("admin"), deleteInterviewer);

export default router;