"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const google_controller_1 = require("../controllers/google.controller");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validate_1 = require("../middleware/validate");
const auth_validator_1 = require("../validators/auth.validator");
const router = express_1.default.Router();
router.post("/register", (0, validate_1.validate)(auth_validator_1.signupSchema), (0, asyncHandler_1.asyncHandler)(authController_1.registerCompany));
router.post("/login", (0, validate_1.validate)(auth_validator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(authController_1.loginUser));
router.post("/google", (0, asyncHandler_1.asyncHandler)(google_controller_1.googleLogin));
router.post("/refresh-token", (0, asyncHandler_1.asyncHandler)(authController_1.refreshToken));
router.post("/logout", authController_1.logoutUser);
exports.default = router;
