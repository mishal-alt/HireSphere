import { Response } from "express";
import User, { UserRole } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// Create Interviewer
export const createInterviewer = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const interviewer = await User.create({
      name,
      email,
      password,
      role: UserRole.INTERVIEWER,
      companyId: req.user.companyId,
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
    const interviewers = await User.find({
      companyId: req.user.companyId,
      role: UserRole.INTERVIEWER,
    }).select("-password");

    res.json(interviewers);
  } catch (error) {
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


