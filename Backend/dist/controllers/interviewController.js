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
exports.saveInterviewNotes = exports.startInterview = exports.submitEvaluation = exports.getInterviewerInterviews = exports.getInterviewerStats = exports.deleteInterview = exports.updateInterview = exports.getInterviewById = exports.getInterviews = exports.createInterview = void 0;
const Interview_1 = __importStar(require("../models/Interview"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
const User_1 = __importStar(require("../models/User"));
const Company_1 = __importDefault(require("../models/Company"));
const notificationUtils_1 = require("../utils/notificationUtils");
const emailService_1 = require("../utils/emailService");
const quotaService_1 = require("../services/quotaService");
const createInterview = async (req, res) => {
    try {
        const { candidateId, interviewerId, scheduledAt } = req.body;
        if (!candidateId || !interviewerId || !scheduledAt) {
            return res.status(400).json({
                message: "candidateId, interviewerId and scheduledAt are required",
            });
        }
        // --- CHECK PLAN LIMITS (3 Interviews for Free Plan) ---
        const company = await Company_1.default.findById(req.user.companyId);
        if (!company)
            return res.status(404).json({ message: "Company not found" });
        const isFree = !company.subscriptionPlan || company.subscriptionPlan === 'free';
        if (isFree) {
            const interviewCount = await Interview_1.default.countDocuments({ companyId: req.user.companyId });
            if (interviewCount >= 3) {
                return res.status(403).json({
                    message: "Interview Limit Reached: You have used your 3 free interviews. Please upgrade to Premium for unlimited video sessions."
                });
            }
        }
        // -----------------------------------------------------
        // --- CHECK QUOTA (2 Emails: Candidate + Interviewer) ---
        const q1 = await (0, quotaService_1.checkAndIncrementEmailQuota)(req.user.companyId);
        const q2 = await (0, quotaService_1.checkAndIncrementEmailQuota)(req.user.companyId);
        if (!q1.allowed || !q2.allowed) {
            return res.status(403).json({ message: "Email Quota Exceeded: You do not have enough email credits to schedule this interview." });
        }
        // --------------------------------------------------------
        const candidate = await Candidate_1.default.findOne({
            _id: candidateId,
            companyId: req.user.companyId,
        });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        const interviewer = await User_1.default.findOne({
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
        const interview = new Interview_1.default({
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
        await (0, notificationUtils_1.sendNotification)(io, interviewerId, {
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
        (0, emailService_1.sendInterviewInvitation)(candidate.email, candidate.name, interviewDate, startTime, endTime, `${process.env.FRONTEND_URL || 'http://localhost:3000'}${candidateLink}`, // Public Guest Link
        interviewer.name, 'candidate', "HireSphere").catch(err => console.error(`[InterviewController] ❌ Candidate invitation failed:`, err));
        console.log(`[InterviewController] Dispatching Interviewer Assignment: ${interviewer.email}`);
        (0, emailService_1.sendInterviewInvitation)(interviewer.email, interviewer.name, interviewDate, startTime, endTime, `${process.env.FRONTEND_URL || 'http://localhost:3000'}${meetLink}`, // Secure Internal Link
        candidate.name, 'interviewer', "HireSphere").catch(err => console.error(`[InterviewController] ❌ Interviewer assignment failed:`, err));
        return res.status(201).json(interview);
    }
    catch (error) {
        console.error("Create Interview Error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message || error
        });
    }
};
exports.createInterview = createInterview;
const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview_1.default.find({
            companyId: req.user.companyId,
        })
            .populate("candidateId", "name email")
            .populate("interviewerId", "name email")
            .sort({ scheduledAt: -1 });
        return res.json(interviews);
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getInterviews = getInterviews;
const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview_1.default.findOne({
            _id: req.params.id,
            companyId: req.user.companyId,
        })
            .populate("candidateId")
            .populate("interviewerId");
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }
        return res.json(interview);
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getInterviewById = getInterviewById;
const updateInterview = async (req, res) => {
    try {
        const interview = await Interview_1.default.findOne({
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
        await (0, notificationUtils_1.sendNotification)(io, interview.interviewerId.toString(), {
            title: 'Interview Updated',
            message: `Your interview with ${populatedInterview.candidateId.name} has been updated/rescheduled.`,
            type: 'interview_updated'
        });
        return res.json(interview);
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.updateInterview = updateInterview;
const deleteInterview = async (req, res) => {
    try {
        const interview = await Interview_1.default.findOneAndDelete({
            _id: req.params.id,
            companyId: req.user.companyId,
        });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }
        // 🔔 NOTIFY INTERVIEWER
        const io = req.app.get('io');
        await (0, notificationUtils_1.sendNotification)(io, interview.interviewerId.toString(), {
            title: 'Interview Cancelled',
            message: `Your interview scheduled for ${new Date(interview.scheduledAt).toLocaleDateString()} has been cancelled.`,
            type: 'interview_cancelled'
        });
        // 🚀 RESET CANDIDATE STATUS to 'Shortlisted'
        await Candidate_1.default.findByIdAndUpdate(interview.candidateId, { status: 'Shortlisted' });
        console.log(`[InterviewController] Candidate status reset to 'Shortlisted' for candidate: ${interview.candidateId}`);
        return res.json({ message: "Interview deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteInterview = deleteInterview;
// GET Stats for Interviewer Dashboard
const getInterviewerStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const companyId = req.user.companyId;
        const totalAssigned = await Interview_1.default.countDocuments({ interviewerId: userId, companyId });
        const upcoming = await Interview_1.default.countDocuments({
            interviewerId: userId,
            companyId,
            status: "Scheduled",
            scheduledAt: { $gte: new Date() }
        });
        const completed = await Interview_1.default.countDocuments({
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
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getInterviewerStats = getInterviewerStats;
// GET Assigned Interviews for Interviewer
const getInterviewerInterviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const companyId = req.user.companyId;
        const interviews = await Interview_1.default.find({
            interviewerId: userId,
            companyId
        })
            .populate("candidateId", "name email role department")
            .sort({ scheduledAt: 1 });
        res.json(interviews);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getInterviewerInterviews = getInterviewerInterviews;
// SUBMIT EVALUATION (Interviewer only)
const submitEvaluation = async (req, res) => {
    try {
        const { id } = req.params;
        const { ratings, comments } = req.body;
        const interview = await Interview_1.default.findOne({
            _id: id,
            interviewerId: req.user.id
        }).populate("candidateId", "name");
        if (!interview) {
            return res.status(404).json({ message: "Interview assignment not found" });
        }
        console.log("[InterviewController] Submitting evaluation for ID:", id);
        console.log("[InterviewController] Received ratings:", ratings);
        console.log("[InterviewController] Received comments:", comments);
        interview.status = Interview_1.InterviewStatus.EVALUATED;
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
        await Candidate_1.default.findByIdAndUpdate(interview.candidateId._id, { status: "Interviewed" });
        // 🚀 PHASE 3: AUTOMATED REPORTING
        const admins = await User_1.default.find({
            companyId: req.user.companyId,
            role: User_1.UserRole.ADMIN
        });
        for (const admin of admins) {
            // --- CHECK QUOTA (Report to Admin) ---
            const quota = await (0, quotaService_1.checkAndIncrementEmailQuota)(req.user.companyId);
            if (!quota.allowed) {
                console.warn(`[Quota Exceeded] Could not send evaluation report to ${admin.email}`);
                continue; // Skip this email but continue with others/socket
            }
            // --------------------------------------
            // 📧 Professional Email Report
            (0, emailService_1.sendEvaluationReport)(admin.email, interview.candidateId.name, req.user.name, finalScore.toFixed(1), comments || "No detailed notes provided.", "HireSphere").catch(err => console.error("[InterviewController] Admin Report failed:", err));
        }
        // 🔔 Notify all Admins via Socket
        const io = req.app.get('io');
        for (const admin of admins) {
            await (0, notificationUtils_1.sendNotification)(io, admin._id.toString(), {
                title: 'Evaluation Submitted!',
                message: `${req.user.name} has submitted the evaluation for ${interview.candidateId.name}.`,
                type: 'interview_evaluated',
                metadata: { interviewId: interview._id, candidateId: interview.candidateId }
            });
        }
        res.json({ message: "Evaluation submitted and notified admins", interview });
    }
    catch (error) {
        console.error("Submit Evaluation Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.submitEvaluation = submitEvaluation;
// 🚀 PHASE 15: INTERVIEW ROOM ACTIONS
// Start Interview (Update status to Ongoing)
const startInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview_1.default.findOne({
            _id: id,
            $or: [{ interviewerId: req.user.id }, { companyId: req.user.companyId }]
        });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }
        interview.status = Interview_1.InterviewStatus.ONGOING;
        await interview.save();
        res.json({ message: "Interview started", interview });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.startInterview = startInterview;
// Save Interview Notes (Real-time sync)
const saveInterviewNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const interview = await Interview_1.default.findOne({
            _id: id,
            interviewerId: req.user.id
        });
        if (!interview) {
            return res.status(404).json({ message: "Interview assignment not found" });
        }
        interview.notes = notes;
        await interview.save();
        res.json({ message: "Notes saved successfully", notes: interview.notes });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.saveInterviewNotes = saveInterviewNotes;
