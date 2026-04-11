"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshToken = exports.loginUser = exports.registerCompany = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Company_1 = __importDefault(require("../models/Company"));
const User_1 = __importStar(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// Company Registration
const registerCompany = async (req, res, next) => {
    const { name, fullName, password } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    // Check if company email exists
    const existingCompany = await Company_1.default.findOne({ email });
    if (existingCompany)
        return next(new errorResponse_1.default("Company email already registered", 400));
    // Check if user email also exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        return next(new errorResponse_1.default("User email already registered", 400));
    const company = await Company_1.default.create({
        name,
        email,
        password,
    });
    // Create Admin user for this company
    const adminUser = await User_1.default.create({
        name: fullName || "Admin",
        email,
        password,
        role: User_1.UserRole.ADMIN,
        companyId: company._id,
    });
    const accessToken = (0, generateToken_1.generateAccessToken)({
        id: adminUser._id.toString(),
        role: adminUser.role,
        companyId: company._id.toString(),
    });
    const refreshToken = (0, generateToken_1.generateRefreshToken)({
        id: adminUser._id.toString(),
        role: adminUser.role,
        companyId: company._id.toString(),
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
        success: true,
        token: accessToken,
        user: {
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            companyId: adminUser.companyId,
            department: adminUser.department,
            profileImage: adminUser.profileImage,
        },
    });
};
exports.registerCompany = registerCompany;
// Login
const loginUser = async (req, res, next) => {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    if (!email || !password) {
        return next(new errorResponse_1.default("Please provide email and password", 400));
    }
    const user = await User_1.default.findOne({ email });
    if (!user)
        return next(new errorResponse_1.default("Invalid credentials", 400));
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return next(new errorResponse_1.default("Invalid credentials", 400));
    const accessToken = (0, generateToken_1.generateAccessToken)({
        id: user._id.toString(),
        role: user.role,
        companyId: user.companyId.toString(),
    });
    const refreshToken = (0, generateToken_1.generateRefreshToken)({
        id: user._id.toString(),
        role: user.role,
        companyId: user.companyId.toString(),
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
        success: true,
        token: accessToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            department: user.department,
            profileImage: user.profileImage,
        },
    });
};
exports.loginUser = loginUser;
// Refresh Token
const refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return next(new errorResponse_1.default("No refresh token", 401));
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh"));
    const user = await User_1.default.findById(decoded.id);
    if (!user)
        return next(new errorResponse_1.default("User not found", 401));
    const newAccessToken = (0, generateToken_1.generateAccessToken)({
        id: user._id.toString(),
        role: user.role,
        companyId: user.companyId.toString(),
    });
    res.json({ success: true, token: newAccessToken });
};
exports.refreshToken = refreshToken;
const logoutUser = (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out" });
};
exports.logoutUser = logoutUser;
