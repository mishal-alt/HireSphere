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
exports.changePassword = exports.uploadImage = exports.getAllParticipants = exports.getUserById = exports.updateProfile = exports.getProfile = exports.deleteInterviewer = exports.updateInterviewer = exports.getInterviewers = exports.createInterviewer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importStar(require("../models/User"));
const Interview_1 = __importDefault(require("../models/Interview"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const notificationUtils_1 = require("../utils/notificationUtils");
// Create Interviewer
const createInterviewer = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const interviewer = await User_1.default.create({
            name,
            email,
            password,
            role: User_1.UserRole.INTERVIEWER,
            companyId: req.user.companyId,
            department: department || "General",
        });
        // 🔔 Notify the new Interviewer
        const io = req.app.get('io');
        await (0, notificationUtils_1.sendNotification)(io, interviewer._id.toString(), {
            title: 'Welcome to HireSphere!',
            message: `You have been added as an interviewer. Please complete your profile.`,
            type: 'user_created'
        });
        res.status(201).json(interviewer);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.createInterviewer = createInterviewer;
const getInterviewers = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Use .find() for automatic casting of req.user.companyId
        const interviewers = await User_1.default.find({
            companyId: req.user.companyId,
            role: User_1.UserRole.INTERVIEWER,
        }).select("-password").lean();
        // Enrich with interview counts and pseudo-ratings
        const enrichedInterviewers = await Promise.all(interviewers.map(async (interviewer) => {
            // Real count from DB
            const interviewsCount = await Interview_1.default.countDocuments({ interviewerId: interviewer._id });
            // Pseudo-rating based on ID for consistency
            const idNum = parseInt(interviewer._id.toString().slice(-4), 16) || 0;
            const rating = 4.0 + (idNum % 11) / 10;
            return {
                ...interviewer,
                interviewsCount,
                rating
            };
        }));
        res.json(enrichedInterviewers);
    }
    catch (error) {
        console.error("Get Interviewers Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getInterviewers = getInterviewers;
const updateInterviewer = async (req, res) => {
    try {
        const interviewer = await User_1.default.findOne({
            _id: req.params.id,
            companyId: req.user.companyId,
        });
        if (!interviewer) {
            return res.status(404).json({ message: "User not found" });
        }
        interviewer.name = req.body.name ?? interviewer.name;
        interviewer.email = req.body.email ?? interviewer.email;
        interviewer.department = req.body.department ?? interviewer.department;
        interviewer.isActive =
            req.body.isActive !== undefined
                ? req.body.isActive
                : interviewer.isActive;
        await interviewer.save();
        res.json({
            message: "Updated successfully",
            interviewer,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateInterviewer = updateInterviewer;
const deleteInterviewer = async (req, res) => {
    try {
        const interviewer = await User_1.default.findOneAndDelete({
            _id: req.params.id,
            companyId: req.user.companyId,
            role: User_1.UserRole.INTERVIEWER,
        });
        if (!interviewer)
            return res.status(404).json({ message: "User not found" });
        res.json({ message: "Interviewer deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteInterviewer = deleteInterviewer;
// Get Current User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getProfile = getProfile;
// Update Current User Profile
const updateProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.name = req.body.name ?? user.name;
        user.email = req.body.email ?? user.email;
        if (req.body.notificationPreferences) {
            user.notificationPreferences = {
                ...user.notificationPreferences,
                ...req.body.notificationPreferences
            };
        }
        if (req.body.interfacePreferences) {
            user.interfacePreferences = {
                ...user.interfacePreferences,
                ...req.body.interfacePreferences
            };
        }
        await user.save();
        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                companyId: user.companyId,
                profileImage: user.profileImage,
                notificationPreferences: user.notificationPreferences,
                interfacePreferences: user.interfacePreferences
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateProfile = updateProfile;
// Get user by ID (Admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findOne({
            _id: req.params.id,
            companyId: req.user.companyId,
        }).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getUserById = getUserById;
// Get all participants for chat (within company, excluding self)
const getAllParticipants = async (req, res) => {
    try {
        const participants = await User_1.default.find({
            companyId: req.user.companyId,
            _id: { $ne: req.user.id }
        })
            .select("name email role department isActive profileImage")
            .lean();
        res.json(participants);
    }
    catch (error) {
        console.error("Get All Participants Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getAllParticipants = getAllParticipants;
// Upload Profile Image
const uploadImage = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            console.error("[Upload] No file or buffer provided in request");
            return res.status(400).json({ success: false, message: "No file uploaded or file is empty" });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID missing." });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            console.error(`[Upload] User not found: ${userId}`);
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(`[Upload] Attempting photo update for: ${user.name}`);
        let profileImageUrl = "";
        let uploadMethod = "unknown";
        // 1. Try Cloudinary if configured
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            try {
                console.log("[Upload] Attempting Cloudinary stream...");
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({
                        folder: `hiresphere/profiles`,
                        public_id: `profile_${user._id}_${Date.now()}`,
                        resource_type: "auto",
                        transformation: [
                            { width: 400, height: 400, crop: "fill", gravity: "face" }
                        ]
                    }, (error, result) => {
                        if (error) {
                            console.error("[Cloudinary Error]", error);
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    });
                    uploadStream.end(req.file.buffer);
                });
                profileImageUrl = result.secure_url;
                uploadMethod = "cloudinary";
                console.log(`[Upload] Cloudinary success: ${profileImageUrl}`);
            }
            catch (cloudinaryErr) {
                console.error("[Upload] Cloudinary failed, falling back to local storage:", cloudinaryErr);
            }
        }
        // 2. Local Fallback (if Cloudinary failed or isn't configured)
        if (!profileImageUrl) {
            console.log("[Upload] Using Local Storage Fallback...");
            const fileName = `profile_${user._id}_${Date.now()}${path_1.default.extname(req.file.originalname) || '.jpg'}`;
            const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'profiles');
            // Ensure directory exists
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path_1.default.join(uploadDir, fileName);
            fs_1.default.writeFileSync(filePath, req.file.buffer);
            profileImageUrl = `/uploads/profiles/${fileName}`;
            uploadMethod = "local";
            console.log(`[Upload] Local storage success: ${profileImageUrl}`);
        }
        // Save to user model
        user.profileImage = profileImageUrl;
        await user.save();
        res.json({
            success: true,
            message: `Profile photo updated via ${uploadMethod}`,
            profileImage: user.profileImage, // Frontend handles prefixing if needed
        });
    }
    catch (error) {
        console.error("CRITICAL UPLOAD CRASH:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during upload",
            error: error.message
        });
    }
};
exports.uploadImage = uploadImage;
// Change Password
const changePassword = async (req, res) => {
    try {
        const currentPassword = req.body.currentPassword?.trim();
        const newPassword = req.body.newPassword?.trim();
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }
        user.password = newPassword; // The User model's pre-save hook will hash this
        await user.save();
        res.json({ message: "Password updated successfully. Please login again." });
    }
    catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.changePassword = changePassword;
