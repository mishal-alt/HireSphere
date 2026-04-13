"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const candidateController_1 = require("../controllers/candidateController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const validate_1 = require("../middleware/validate");
const candidate_validator_1 = require("../validators/candidate.validator");
const router = express_1.default.Router();
const planMiddleware_1 = require("../middleware/planMiddleware");
// Only Admin can manage candidates
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), uploadMiddleware_1.uploadResume.single("resume"), (0, validate_1.validate)(candidate_validator_1.createCandidateSchema), candidateController_1.createCandidate);
// Only Admin and Interviewer can view candidates
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "interviewer"), candidateController_1.getCandidates);
router.get("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "interviewer"), candidateController_1.getCandidateById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, validate_1.validate)(candidate_validator_1.updateCandidateSchema), candidateController_1.updateCandidate);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), candidateController_1.deleteCandidate);
router.post("/:id/message", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, planMiddleware_1.checkPlan)('premium'), candidateController_1.sendMessage);
router.post("/:id/generate-offer", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, planMiddleware_1.checkPlan)('premium'), candidateController_1.generateOfferLetter);
router.patch("/:id/hire", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), candidateController_1.hireCandidate);
router.patch("/:id/reject", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), candidateController_1.rejectCandidate);
exports.default = router;
