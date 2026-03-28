import express from "express";
import { getJobs, createJob, updateJob, deleteJob } from "../controllers/jobController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { jobSchema, updateJobSchema } from "../validators/job.validator";

const router = express.Router();

router.get("/", protect, getJobs);
router.post("/", protect, validate(jobSchema), createJob);
router.put("/:id", protect, validate(updateJobSchema), updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
