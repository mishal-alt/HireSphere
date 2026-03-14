import mongoose from "mongoose";
import { Response } from "express";
import User, { UserRole } from "../models/User";
import Interview from "../models/Interview";
import { AuthRequest } from "../middleware/authMiddleware";

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
    // You can add more fields here if needed, like department if allowed

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        companyId: user.companyId
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