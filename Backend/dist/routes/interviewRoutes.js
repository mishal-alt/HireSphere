"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewController_1 = require("../controllers/interviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const validate_1 = require("../middleware/validate");
const interview_validator_1 = require("../validators/interview.validator");
const router = express_1.default.Router();
// Admin only
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, validate_1.validate)(interview_validator_1.createInterviewSchema), interviewController_1.createInterview);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), interviewController_1.getInterviews);
// Admin & Interviewer Access
router.get("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "interviewer"), interviewController_1.getInterviewById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, validate_1.validate)(interview_validator_1.updateInterviewSchema), interviewController_1.updateInterview);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), interviewController_1.deleteInterview);
// Interviewer specific
router.get("/interviewer/stats", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("interviewer"), interviewController_1.getInterviewerStats);
router.get("/interviewer/my-interviews", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("interviewer"), interviewController_1.getInterviewerInterviews);
router.post("/interviewer/submit-evaluation/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("interviewer"), interviewController_1.submitEvaluation);
// Phase 15 - Interview Room Actions
router.patch("/interviewer/start/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("interviewer", "admin"), interviewController_1.startInterview);
router.patch("/interviewer/notes/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("interviewer"), interviewController_1.saveInterviewNotes);
exports.default = router;
