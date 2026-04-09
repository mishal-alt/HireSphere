import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Interview, { InterviewStatus } from "../models/Interview";
import Candidate from "../models/Candidate";
import User, { UserRole } from "../models/User";
import { calendar } from "../config/google";
import { sendNotification } from "../utils/notificationUtils";
import { sendInterviewInvitation, sendEvaluationReport } from "../utils/emailService";
import { checkAndIncrementEmailQuota } from "../services/quotaService";

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

    // --- CHECK QUOTA (2 Emails: Candidate + Interviewer) ---
    const q1 = await checkAndIncrementEmailQuota(req.user.companyId);
    const q2 = await checkAndIncrementEmailQuota(req.user.companyId);
    
    if (!q1.allowed || !q2.allowed) {
      return res.status(403).json({ message: "Email Quota Exceeded: You do not have enough email credits to schedule this interview." });
    }
    // --------------------------------------------------------
    
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

    // 📅 Prepare session timing
    const startDate = new Date(scheduledAt);
    
    // 💾 1. Create and Save Interview to generate ID
    const interview = new Interview({
      companyId: req.user.companyId,
      candidateId,
      interviewerId,
      scheduledAt: startDate,
      status: "Scheduled",
      meetLink: '' // Will update in a moment
    });

    await interview.save();

    // 🔗 2. Generate specialized links using the DB ID
    const meetLink = `/interviewer/interview-room/${interview._id}`;
    const candidateLink = `/interview/${interview._id}`;

    // Update the record with the primary meet link
    interview.meetLink = meetLink;
    await interview.save();

    // 🔔 3. NOTIFY INTERVIEWER VIA SOCKET
    const io = req.app.get('io');
    console.log(`[InterviewController] Scheduling interview. Notifying interviewer: ${interviewerId}`);
    await sendNotification(io, interviewerId, {
      title: 'New Interview Assigned',
      message: `You have an interview with ${candidate.name} on ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}.`,
      type: 'interview_created',
      metadata: { interviewId: interview._id }
    });

    // 🚀 4. Update Candidate Status
    candidate.status = "Scheduled";
    await candidate.save();

    // 🚀 5. PHASE 1: AUTOMATED COMMUNICATION (Emails)
    const interviewDate = startDate.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    const startTime = startDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
    });
    const endTimeObj = new Date(startDate.getTime() + 60 * 60 * 1000); // 1hr duration
    const endTime = endTimeObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
    });

    console.log(`[InterviewController] Dispatching Candidate Invitation: ${candidate.email}`);
    sendInterviewInvitation(
        candidate.email,
        candidate.name,
        interviewDate,
        startTime,
        endTime,
        `http://localhost:3000${candidateLink}`, // Public Guest Link
        interviewer.name,
        'candidate',
        "HireSphere"
    ).catch(err => console.error(`[InterviewController] ❌ Candidate invitation failed:`, err));

    console.log(`[InterviewController] Dispatching Interviewer Assignment: ${interviewer.email}`);
    sendInterviewInvitation(
        interviewer.email,
        interviewer.name,
        interviewDate,
        startTime,
        endTime,
        `http://localhost:3000${meetLink}`, // Secure Internal Link
        candidate.name,
        'interviewer',
        "HireSphere"
    ).catch(err => console.error(`[InterviewController] ❌ Interviewer assignment failed:`, err));

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

    // 🚀 RESET CANDIDATE STATUS to 'Shortlisted'
    await Candidate.findByIdAndUpdate(interview.candidateId, { status: 'Shortlisted' });
    console.log(`[InterviewController] Candidate status reset to 'Shortlisted' for candidate: ${interview.candidateId}`);

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
    const { ratings, comments } = req.body;
    
    const interview = await Interview.findOne({
        _id: id,
        interviewerId: req.user.id
    }).populate("candidateId", "name");

    if (!interview) {
        return res.status(404).json({ message: "Interview assignment not found" });
    }

    console.log("[InterviewController] Submitting evaluation for ID:", id);
    console.log("[InterviewController] Received ratings:", ratings);
    console.log("[InterviewController] Received comments:", comments);

    interview.status = InterviewStatus.EVALUATED;
    
    // Explicitly set each rating field ensuring they are numbers
    interview.ratings = {
        technical: Number(ratings.technical) || 0,
        communication: Number(ratings.communication) || 0,
        problemSolving: Number(ratings.problemSolving) || 0,
        culturalFit: Number(ratings.culturalFit) || 0
    };
    
    interview.evaluationComments = comments;
    
    // Ensure Mongoose tracks the nested object change
    interview.markModified('ratings');
    
    const finalScore = ratings ? (Object.values(ratings).map(Number).reduce((a, b) => a + b, 0) / Object.keys(ratings).length) : 0;
    console.log("[InterviewController] Final calculated score:", finalScore);
    
    interview.score = finalScore;
    await interview.save();

    // 🚀 Update Candidate status to 'Interviewed'
    await Candidate.findByIdAndUpdate((interview.candidateId as any)._id, { status: "Interviewed" });

    // 🚀 PHASE 3: AUTOMATED REPORTING
    const admins = await User.find({ 
        companyId: req.user.companyId, 
        role: UserRole.ADMIN 
    });

    for (const admin of admins) {
        // --- CHECK QUOTA (Report to Admin) ---
        const quota = await checkAndIncrementEmailQuota(req.user.companyId);
        if (!quota.allowed) {
            console.warn(`[Quota Exceeded] Could not send evaluation report to ${admin.email}`);
            continue; // Skip this email but continue with others/socket
        }
        // --------------------------------------

        // 📧 Professional Email Report
        sendEvaluationReport(
            admin.email,
            (interview.candidateId as any).name,
            req.user.name,
            finalScore.toFixed(1),
            comments || "No detailed notes provided.",
            "HireSphere"
        ).catch(err => console.error("[InterviewController] Admin Report failed:", err));
    }

    // 🔔 Notify all Admins via Socket
    const io = req.app.get('io');
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

// 🚀 PHASE 15: INTERVIEW ROOM ACTIONS

// Start Interview (Update status to Ongoing)
export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({
      _id: id,
      $or: [{ interviewerId: req.user.id }, { companyId: req.user.companyId }]
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.status = InterviewStatus.ONGOING;
    await interview.save();

    res.json({ message: "Interview started", interview });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Save Interview Notes (Real-time sync)
export const saveInterviewNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const interview = await Interview.findOne({
      _id: id,
      interviewerId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview assignment not found" });
    }

    interview.notes = notes;
    await interview.save();

    res.json({ message: "Notes saved successfully", notes: interview.notes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};