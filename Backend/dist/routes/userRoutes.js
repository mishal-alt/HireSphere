"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const validate_1 = require("../middleware/validate");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const interviewer_validator_1 = require("../validators/interviewer.validator");
const router = express_1.default.Router();
// Self profile management
router.get("/profile", authMiddleware_1.protect, userController_1.getProfile);
router.put("/profile", authMiddleware_1.protect, userController_1.updateProfile);
router.put("/profile/image", authMiddleware_1.protect, uploadMiddleware_1.uploadProfileImage.single('image'), userController_1.uploadImage);
router.put("/change-password", authMiddleware_1.protect, (0, asyncHandler_1.asyncHandler)(userController_1.changePassword));
// Chat participant discovery for everyone in company
router.get("/chat-participants", authMiddleware_1.protect, userController_1.getAllParticipants);
// Only Admin can manage interviewers
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, validate_1.validate)(interviewer_validator_1.createInterviewerSchema), userController_1.createInterviewer);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), userController_1.getInterviewers);
router.get("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), userController_1.getUserById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), (0, validate_1.validate)(interviewer_validator_1.updateInterviewerSchema), userController_1.updateInterviewer);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), userController_1.deleteInterviewer);
exports.default = router;
