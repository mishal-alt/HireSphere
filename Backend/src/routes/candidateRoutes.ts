import express from "express";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  sendMessage,
  hireCandidate,
  rejectCandidate,
  generateOfferLetter,
} from "../controllers/candidateController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { uploadResume as upload } from "../middleware/uploadMiddleware";
import { validate } from "../middleware/validate";
import { createCandidateSchema, updateCandidateSchema } from "../validators/candidate.validator";

const router = express.Router();
import { checkPlan } from "../middleware/planMiddleware";

// Only Admin can manage candidates
router.post("/", protect, authorize("admin"), upload.single("resume"), validate(createCandidateSchema), createCandidate);
// Only Admin and Interviewer can view candidates
router.get("/", protect, authorize("admin", "interviewer"), getCandidates);
router.get("/:id", protect, authorize("admin", "interviewer"), getCandidateById);
router.put("/:id", protect, authorize("admin"), validate(updateCandidateSchema), updateCandidate);
router.delete("/:id", protect, authorize("admin"), deleteCandidate);
router.post("/:id/message", protect, authorize("admin"), checkPlan('premium'), sendMessage);
router.post("/:id/generate-offer", protect, authorize("admin"), checkPlan('premium'), generateOfferLetter);
router.patch("/:id/hire", protect, authorize("admin"), hireCandidate);
router.patch("/:id/reject", protect, authorize("admin"), rejectCandidate);

export default router;