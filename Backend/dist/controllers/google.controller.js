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
exports.googleLogin = exports.googleCallback = void 0;
const google_1 = __importDefault(require("../config/google"));
const User_1 = __importStar(require("../models/User"));
const Company_1 = __importDefault(require("../models/Company"));
const generateToken_1 = require("../utils/generateToken");
const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).send("No code provided");
        }
        const { tokens } = await google_1.default.getToken(code);
        console.log("------------------------------------------");
        console.log("FULL GOOGLE TOKENS RECEIVED:", JSON.stringify(tokens, null, 2));
        console.log("------------------------------------------");
        if (tokens.refresh_token) {
            console.log(">>> COPY THIS REFRESH TOKEN TO YOUR .ENV <<<");
            console.log(tokens.refresh_token);
            console.log("------------------------------------------");
        }
        else {
            console.log("WARNING: No Refresh Token received. Try revoking app access at https://myaccount.google.com/permissions and try again.");
        }
        res.send("<h1>Google Connected!</h1><p>Check your backend terminal for the Refresh Token.</p>");
    }
    catch (error) {
        console.error("Error getting tokens:", error.response?.data || error.message);
        res.status(500).json({
            message: "Error getting tokens",
            error: error.response?.data || error.message
        });
    }
};
exports.googleCallback = googleCallback;
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "Google ID Token is required" });
        }
        // Verify Google token
        const ticket = await google_1.default.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: "Invalid Google token" });
        }
        const { email, name, picture, sub: googleId } = payload;
        // 1. Check if user exists
        let user = await User_1.default.findOne({ email });
        if (!user) {
            // 2. If user doesn't exist, create a new Company and User (as Admin)
            // For a new signup via Google, we use their name as the company name temporarily
            const company = await Company_1.default.create({
                name: `${name}'s Company`,
                email: email,
                password: Math.random().toString(36).slice(-10), // Random password for schema requirement
            });
            user = await User_1.default.create({
                name: name || "Google User",
                email: email,
                password: Math.random().toString(36).slice(-10),
                role: User_1.UserRole.ADMIN,
                companyId: company._id,
            });
        }
        // 3. Generate tokens
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
            token: accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                profileImage: user.profileImage || picture
            },
        });
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google Authentication failed", error: error.message });
    }
};
exports.googleLogin = googleLogin;
