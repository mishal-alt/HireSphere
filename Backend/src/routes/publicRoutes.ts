import express from "express";
import { 
    getPublicJobs, 
    getPublicJobById, 
    submitApplication 
} from "../controllers/publicController";
import { uploadResume } from "../middleware/uploadMiddleware";

const router = express.Router();

// Get all active jobs for a company ID
router.get("/jobs/:companyId", getPublicJobs);

// Get details of a specific job
router.get("/job/:jobId", getPublicJobById);

// Submit application with resume
router.post("/apply", uploadResume.single("resume"), submitApplication);

export default router;
