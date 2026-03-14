import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Only admin and interviewer can access company profile
router.get("/profile", protect, authorize("admin", "interviewer"), getCompanyProfile);
router.put("/profile", protect, authorize("admin"), updateCompanyProfile);

export default router;