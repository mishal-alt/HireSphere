"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicController_1 = require("../controllers/publicController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express_1.default.Router();
// Get all active jobs for a company ID
router.get("/jobs/:companyId", publicController_1.getPublicJobs);
// Get details of a specific job
router.get("/job/:jobId", publicController_1.getPublicJobById);
// Submit application with resume
router.post("/apply", uploadMiddleware_1.uploadResume.single("resume"), publicController_1.submitApplication);
// Candidate Offer Routes
router.get("/offer/:id", publicController_1.getOfferDetails);
router.post("/offer/:id/sign", publicController_1.signOffer);
// Candidate Interview Room Routes
router.get("/interview/:id", publicController_1.getInterviewDetails);
exports.default = router;
