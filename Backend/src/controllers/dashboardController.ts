import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Candidate from "../models/Candidate";
import Interview from "../models/Interview";
import User, { UserRole } from "../models/User";
import Job from "../models/Job";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const companyId = req.user.companyId;

        // 1. New Candidates (Total count for this company)
        const totalCandidates = await Candidate.countDocuments({ companyId });

        // 2. Interviews Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const interviewsToday = await Interview.countDocuments({
            companyId,
            scheduledAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 3. Interviewers (Total count)
        const totalInterviewers = await User.countDocuments({
            companyId,
            role: UserRole.INTERVIEWER
        });

        // 4. Total Jobs
        const totalJobs = await Job.countDocuments({ companyId });

        // 6. Conducted Interviews (Total completed)
        const conductedInterviews = await Interview.countDocuments({
            companyId,
            status: "Completed"
        });

        // 5. Recent Interviews (last 5)
        const recentInterviews = await Interview.find({ companyId })
            .populate("candidateId", "name email")
            .populate("interviewerId", "name role")
            .sort({ scheduledAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalCandidates,
                interviewsToday,
                totalInterviewers,
                totalJobs,
                conductedInterviews,
                successRate: "94%" // Placeholder or calculated from history if status 'Passed' exists
            },
            recentInterviews
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
