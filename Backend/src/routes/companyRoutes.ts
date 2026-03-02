import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Only admin can access company profile
router.get("/profile", protect, authorize("admin"), getCompanyProfile);
router.put("/profile", protect, authorize("admin"), updateCompanyProfile);

export default router;