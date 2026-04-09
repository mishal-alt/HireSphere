import mongoose from "mongoose";
import { Response } from "express";
import fs from "fs";
import path from "path";
import User, { UserRole } from "../models/User";
import Interview from "../models/Interview";
import { AuthRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import bcrypt from "bcryptjs";
import { sendNotification } from "../utils/notificationUtils";



// Create Interviewer
export const createInterviewer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, email, password, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const interviewer = await User.create({
      name,
      email,
      password,
      role: UserRole.INTERVIEWER,
      companyId: req.user.companyId,
      department: department || "General",
    });

    // 🔔 Notify the new Interviewer
    const io = req.app.get('io');
    await sendNotification(io, interviewer._id.toString(), {
      title: 'Welcome to HireSphere!',
      message: `You have been added as an interviewer. Please complete your profile.`,
      type: 'user_created'
    });

    res.status(201).json(interviewer);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const getInterviewers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || !req.user.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Use .find() for automatic casting of req.user.companyId
    const interviewers = await User.find({
      companyId: req.user.companyId,
      role: UserRole.INTERVIEWER,
    }).select("-password").lean();

    // Enrich with interview counts and pseudo-ratings
    const enrichedInterviewers = await Promise.all(interviewers.map(async (interviewer) => {
      // Real count from DB
      const interviewsCount = await Interview.countDocuments({ interviewerId: interviewer._id });

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
  } catch (error) {
    console.error("Get Interviewers Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateInterviewer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviewer = await User.findOne({
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
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteInterviewer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviewer = await User.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
      role: UserRole.INTERVIEWER,
    });

    if (!interviewer)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Interviewer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// Get Current User Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Current User Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

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

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all participants for chat (within company, excluding self)
export const getAllParticipants = async (req: AuthRequest, res: Response) => {
  try {
    const participants = await User.find({
      companyId: req.user.companyId,
      _id: { $ne: req.user.id }
    })
      .select("name email role department isActive profileImage")

      .lean();

    res.json(participants);
  } catch (error) {
    console.error("Get All Participants Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Upload Profile Image
export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      console.error("[Upload] No file or buffer provided in request");
      return res.status(400).json({ success: false, message: "No file uploaded or file is empty" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. User ID missing." });
    }

    const user = await User.findById(userId);
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
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `hiresphere/profiles`,
              public_id: `profile_${user._id}_${Date.now()}`,
              resource_type: "auto",
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" }
              ]
            },
            (error, result) => {
              if (error) {
                console.error("[Cloudinary Error]", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(req.file!.buffer);
        });
        profileImageUrl = result.secure_url;
        uploadMethod = "cloudinary";
        console.log(`[Upload] Cloudinary success: ${profileImageUrl}`);
      } catch (cloudinaryErr) {
        console.error("[Upload] Cloudinary failed, falling back to local storage:", cloudinaryErr);
      }
    }

    // 2. Local Fallback (if Cloudinary failed or isn't configured)
    if (!profileImageUrl) {
      console.log("[Upload] Using Local Storage Fallback...");
      const fileName = `profile_${user._id}_${Date.now()}${path.extname(req.file.originalname) || '.jpg'}`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);

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

  } catch (error: any) {
    console.error("CRITICAL UPLOAD CRASH:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during upload",
      error: error.message
    });
  }
};

// Change Password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const currentPassword = req.body.currentPassword?.trim();
    const newPassword = req.body.newPassword?.trim();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    user.password = newPassword; // The User model's pre-save hook will hash this
    await user.save();

    res.json({ message: "Password updated successfully. Please login again." });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};