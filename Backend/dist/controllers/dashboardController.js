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
exports.getDashboardStats = void 0;
const Candidate_1 = __importDefault(require("../models/Candidate"));
const Interview_1 = __importDefault(require("../models/Interview"));
const User_1 = __importStar(require("../models/User"));
const Job_1 = __importDefault(require("../models/Job"));
const getDashboardStats = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        // 1. Total Candidates & Trend (This month vs Last month)
        const totalCandidates = await Candidate_1.default.countDocuments({ companyId });
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);
        thisMonthStart.setHours(0, 0, 0, 0);
        const lastMonthStart = new Date(thisMonthStart);
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        const candidatesThisMonth = await Candidate_1.default.countDocuments({
            companyId,
            createdAt: { $gte: thisMonthStart }
        });
        const candidatesLastMonth = await Candidate_1.default.countDocuments({
            companyId,
            createdAt: { $gte: lastMonthStart, $lt: thisMonthStart }
        });
        // Calculate trend percentage (vs last month)
        const candidateTrend = totalCandidates > 0 && candidatesLastMonth > 0
            ? `${Math.round(((candidatesThisMonth - candidatesLastMonth) / candidatesLastMonth) * 100)}%`
            : (candidatesThisMonth > 0 ? `+${candidatesThisMonth}` : "0%");
        // 2. Interviews Today & Trend (vs Yesterday)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const startOfYesterday = new Date(startOfDay);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        const interviewsToday = await Interview_1.default.countDocuments({
            companyId,
            scheduledAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const interviewsYesterday = await Interview_1.default.countDocuments({
            companyId,
            scheduledAt: { $gte: startOfYesterday, $lt: startOfDay }
        });
        const interviewTrend = (interviewsToday > 0 || interviewsYesterday > 0)
            ? (interviewsToday >= interviewsYesterday
                ? `+${interviewsToday - interviewsYesterday}`
                : `${interviewsToday - interviewsYesterday}`)
            : "0";
        // 3. Interviewers (Total count)
        const totalInterviewers = await User_1.default.countDocuments({
            companyId,
            role: User_1.UserRole.INTERVIEWER
        });
        // 4. Total Jobs
        const totalJobs = await Job_1.default.countDocuments({ companyId });
        // 5. Conducted Interviews (Total completed)
        const conductedInterviews = await Interview_1.default.countDocuments({
            companyId,
            status: "Completed"
        });
        // 6. Recent Interviews (last 5)
        const recentInterviews = await Interview_1.default.find({ companyId })
            .populate("candidateId", "name email profileImage")
            .populate("interviewerId", "name role")
            .sort({ scheduledAt: -1 })
            .limit(5);
        // 7. Talent Distribution by Department
        let candidateDistribution = await Candidate_1.default.aggregate([
            { $match: { companyId } },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: { path: '$job', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$job.department', 'General'] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        // 8. Growth Trend (Candidates added in last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const growthTrendData = await Candidate_1.default.aggregate([
            { $match: { companyId, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        // Fill in missing months with 0
        let growthTrend = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(sixMonthsAgo);
            d.setMonth(d.getMonth() + i);
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            const found = growthTrendData.find(g => g._id.month === m && g._id.year === y);
            growthTrend.push(found ? found.count : 0);
        }
        const expansionRate = (growthTrend[5] > 0 || growthTrend[0] > 0)
            ? (growthTrend[5] >= growthTrend[0] ? `+${Math.round(((growthTrend[5] - growthTrend[0]) / Math.max(growthTrend[0], 1)) * 100)}%` : `-${Math.round(((growthTrend[0] - growthTrend[5]) / growthTrend[0]) * 100)}%`)
            : "Stable";
        // 9. Success Rate (Hired candidates / Total candidates)
        const hiredCandidates = await Candidate_1.default.countDocuments({
            companyId,
            status: { $in: ["Hired", "Hired (Signed)"] }
        });
        const successRateCount = totalCandidates > 0
            ? Math.round((hiredCandidates / totalCandidates) * 100)
            : 0;
        res.json({
            stats: {
                totalCandidates,
                candidateTrend,
                interviewsToday,
                interviewTrend,
                totalInterviewers,
                totalJobs,
                conductedInterviews,
                successRate: `${successRateCount}%`,
                expansionRate
            },
            recentInterviews,
            talentDistribution: candidateDistribution.map(d => ({
                label: d._id,
                count: d.count,
                percent: (totalCandidates > 0)
                    ? `${Math.round((d.count / totalCandidates) * 100)}%`
                    : "0%"
            })),
            growthTrend
        });
    }
    catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getDashboardStats = getDashboardStats;
