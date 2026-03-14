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
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// Only Admin can manage candidates
router.post("/",protect,authorize("admin"),upload.single("resume"),createCandidate);
// Only Admin and Interviewer can view candidates
router.get("/", protect, authorize("admin", "interviewer"), getCandidates);
router.get("/:id", protect, authorize("admin", "interviewer"), getCandidateById);
router.put("/:id", protect, authorize("admin"), updateCandidate);
router.delete("/:id", protect, authorize("admin"), deleteCandidate);

export default router;