"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = require("../controllers/companyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = express_1.default.Router();
// Only admin and interviewer can access company profile
router.get("/profile", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "interviewer"), (0, asyncHandler_1.asyncHandler)(companyController_1.getCompanyProfile));
router.put("/profile", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), uploadMiddleware_1.uploadProfileImage.single("logo"), (0, asyncHandler_1.asyncHandler)(companyController_1.updateCompanyProfile));
exports.default = router;
