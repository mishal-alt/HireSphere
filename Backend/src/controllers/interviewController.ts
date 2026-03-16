import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Interview from "../models/Interview";
import Candidate from "../models/Candidate";
import User from "../models/User";
import { calendar } from "../config/google";

export const createInterview = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { candidateId, interviewerId, scheduledAt } = req.body;

    if (!candidateId || !interviewerId || !scheduledAt) {
      return res.status(400).json({
        message: "candidateId, interviewerId and scheduledAt are required",
      });
    }
    
    const candidate = await Candidate.findOne({
      _id: candidateId,
      companyId: req.user.companyId,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const interviewer = await User.findOne({
      _id: interviewerId,
      companyId: req.user.companyId,
      role: "interviewer",
    });

    if (!interviewer) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    // 📅 Create internal meet link for future custom video call setup
    const startDate = new Date(scheduledAt);
    
    // Using a random string or hash for the room ID for now
    const roomId = Math.random().toString(36).substring(7);
    const meetLink = `/interviewer/interview-room?id=${roomId}`;

    // 💾 Store interview in DB
    const interview = await Interview.create({
      companyId: req.user.companyId,
      candidateId,
      interviewerId,
      scheduledAt: startDate,
      meetLink,
      status: "Scheduled",
    });

    return res.status(201).json(interview);
  } catch (error: any) {
    console.error("Create Interview Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message || error
    });
  }
};

export const getInterviews = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interviews = await Interview.find({
      companyId: req.user.companyId,
    })
      .populate("candidateId", "name email")
      .populate("interviewerId", "name email")
      .sort({ scheduledAt: -1 });

    return res.json(interviews);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getInterviewById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .populate("candidateId")
      .populate("interviewerId");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    return res.json(interview);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateInterview = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (req.body.scheduledAt) {
      interview.scheduledAt = new Date(req.body.scheduledAt);
    }

    if (req.body.status) {
      interview.status = req.body.status;
    }

    await interview.save();

    return res.json(interview);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteInterview = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    return res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET Stats for Interviewer Dashboard
export const getInterviewerStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const companyId = req.user.companyId;

    const totalAssigned = await Interview.countDocuments({ interviewerId: userId, companyId });
    const upcoming = await Interview.countDocuments({ 
      interviewerId: userId, 
      companyId, 
      status: "Scheduled",
      scheduledAt: { $gte: new Date() }
    });
    const completed = await Interview.countDocuments({ 
      interviewerId: userId, 
      companyId, 
      status: { $in: ["Completed", "Evaluated"] } 
    });

    // Dummy avg score for now as we don't have evaluation scores in DB yet
    const avgScore = 4.2;

    res.json({
      totalAssigned,
      upcoming,
      completed,
      avgScore
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET Assigned Interviews for Interviewer
export const getInterviewerInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const companyId = req.user.companyId;

    const interviews = await Interview.find({ 
      interviewerId: userId, 
      companyId 
    })
    .populate("candidateId", "name email role department")
    .sort({ scheduledAt: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};