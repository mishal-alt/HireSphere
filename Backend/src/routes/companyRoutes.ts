import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { uploadProfileImage } from "../middleware/uploadMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

// Only admin and interviewer can access company profile
router.get("/profile", protect, authorize("admin", "interviewer"), asyncHandler(getCompanyProfile));
router.put("/profile", protect, authorize("admin"), uploadProfileImage.single("logo"), asyncHandler(updateCompanyProfile));

export default router;