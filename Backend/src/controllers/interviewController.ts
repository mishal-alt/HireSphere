import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Interview, { InterviewStatus } from "../models/Interview";
import Candidate from "../models/Candidate";
import User, { UserRole } from "../models/User";
import { calendar } from "../config/google";
import { sendNotification } from "../utils/notificationUtils";

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

    // 🔔 NOTIFY INTERVIEWER
    const io = req.app.get('io');
    if (!io) {
        console.warn("[InterviewController] io instance not found in req.app");
    }

    console.log(`[InterviewController] Scheduling interview. Notifying interviewer: ${interviewerId}`);
    await sendNotification(io, interviewerId, {
      title: 'New Interview Assigned',
      message: `You have an interview with ${candidate.name} on ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}.`,
      type: 'interview_created',
      metadata: { interviewId: interview._id }
    });

    // 🚀 Update Candidate Status to Scheduled
    candidate.status = "Scheduled";
    await candidate.save();
    console.log(`[InterviewController] Candidate status updated to 'Scheduled' for: ${candidate.name}`);


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

    // 🔔 NOTIFY INTERVIEWER
    const io = req.app.get('io');
    const populatedInterview = await interview.populate("candidateId", "name");
    await sendNotification(io, interview.interviewerId.toString(), {
        title: 'Interview Updated',
        message: `Your interview with ${ (populatedInterview.candidateId as any).name } has been updated/rescheduled.`,
        type: 'interview_updated'
    });

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

    // 🔔 NOTIFY INTERVIEWER
    const io = req.app.get('io');
    await sendNotification(io, interview.interviewerId.toString(), {
        title: 'Interview Cancelled',
        message: `Your interview scheduled for ${new Date(interview.scheduledAt).toLocaleDateString()} has been cancelled.`,
        type: 'interview_cancelled'
    });

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

// SUBMIT EVALUATION (Interviewer only)
export const submitEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const interview = await Interview.findOne({
        _id: id,
        interviewerId: req.user.id
    }).populate("candidateId", "name");

    if (!interview) {
        return res.status(404).json({ message: "Interview assignment not found" });
    }

    interview.status = InterviewStatus.EVALUATED;
    await interview.save();

    // 🚀 Update Candidate status to 'Interviewed'
    await Candidate.findByIdAndUpdate(interview.candidateId, { status: "Interviewed" });

    // 🔔 Notify all Admins
    const io = req.app.get('io');
    const admins = await User.find({ 
        companyId: req.user.companyId, 
        role: UserRole.ADMIN 
    });

    for (const admin of admins) {
        await sendNotification(io, admin._id.toString(), {
            title: 'Evaluation Submitted!',
            message: `${req.user.name} has submitted the evaluation for ${ (interview.candidateId as any).name }.`,
            type: 'interview_evaluated',
            metadata: { interviewId: interview._id, candidateId: interview.candidateId }
        });
    }

    res.json({ message: "Evaluation submitted and notified admins", interview });
  } catch (error: any) {
    console.error("Submit Evaluation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};