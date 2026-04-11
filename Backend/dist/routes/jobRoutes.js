"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const job_validator_1 = require("../validators/job.validator");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.protect, jobController_1.getJobs);
router.post("/", authMiddleware_1.protect, (0, validate_1.validate)(job_validator_1.jobSchema), jobController_1.createJob);
router.put("/:id", authMiddleware_1.protect, (0, validate_1.validate)(job_validator_1.updateJobSchema), jobController_1.updateJob);
router.delete("/:id", authMiddleware_1.protect, jobController_1.deleteJob);
exports.default = router;
