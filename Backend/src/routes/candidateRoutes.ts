import express from "express";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { uploadProfileImage as upload } from "../middleware/uploadMiddleware";
import { validate } from "../middleware/validate";
import { createCandidateSchema, updateCandidateSchema } from "../validators/candidate.validator";

const router = express.Router();

// Only Admin can manage candidates
router.post("/", protect, authorize("admin"), upload.single("resume"), validate(createCandidateSchema), createCandidate);
// Only Admin and Interviewer can view candidates
router.get("/", protect, authorize("admin", "interviewer"), getCandidates);
router.get("/:id", protect, authorize("admin", "interviewer"), getCandidateById);
router.put("/:id", protect, authorize("admin"), validate(updateCandidateSchema), updateCandidate);
router.delete("/:id", protect, authorize("admin"), deleteCandidate);

export default router;