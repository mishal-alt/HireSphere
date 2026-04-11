"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const Candidate_1 = __importDefault(require("../models/Candidate"));
const Interview_1 = __importDefault(require("../models/Interview"));
const getAnalytics = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        // 0. Total Potential Candidates
        const totalCandidates = await Candidate_1.default.countDocuments({ companyId });
        // 1. Core Metrics
        const totalHires = await Candidate_1.default.countDocuments({
            companyId,
            status: { $in: ["Hired", "Hired (Signed)"] }
        });
        const activePipeline = await Candidate_1.default.countDocuments({
            companyId,
            status: { $in: ["Shortlisted", "Scheduled", "Interviewed", "Offered"] }
        });
        const totalOffered = await Candidate_1.default.countDocuments({
            companyId,
            status: { $in: ["Offered", "Hired", "Hired (Signed)"] }
        });
        const offerAcceptanceRate = totalOffered > 0
            ? Math.round((totalHires / totalOffered) * 100)
            : 0;
        // Avg Time to Hire (Simplistic: Average of JoiningDate - CreatedAt for Hired candidates)
        const hiredCandidates = await Candidate_1.default.find({
            companyId,
            status: { $in: ["Hired", "Hired (Signed)"] },
            joiningDate: { $exists: true }
        });
        let avgTimeToHire = 0;
        if (hiredCandidates.length > 0) {
            const totalDays = hiredCandidates.reduce((acc, candidate) => {
                const created = new Date(candidate.createdAt);
                const joined = new Date(candidate.joiningDate);
                const diffTime = Math.abs(joined.getTime() - created.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return acc + diffDays;
            }, 0);
            avgTimeToHire = Math.round(totalDays / hiredCandidates.length);
        }
        // 2. Hiring Velocity (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const velocityData = await Candidate_1.default.aggregate([
            {
                $match: {
                    companyId,
                    status: { $in: ["Hired", "Hired (Signed)"] },
                    joiningDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$joiningDate" },
                        year: { $year: "$joiningDate" }
                    },
                    totalDays: {
                        $sum: {
                            $divide: [
                                { $subtract: ["$joiningDate", "$createdAt"] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const velocity = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(sixMonthsAgo);
            d.setMonth(d.getMonth() + i);
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            const found = velocityData.find(v => v._id.month === m && v._id.year === y);
            velocity.push({
                label: months[m - 1],
                value: found ? Math.round(found.totalDays / found.count) : 0
            });
        }
        // 3. Department Efficiency
        let deptEfficiency = await Candidate_1.default.aggregate([
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
                    _id: { $ifNull: ['$job.department', 'Other'] },
                    total: { $sum: 1 },
                    hired: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Hired", "Hired (Signed)"]] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    label: "$_id",
                    percent: {
                        $cond: [
                            { $gt: ["$total", 0] },
                            { $round: [{ $multiply: [{ $divide: ["$hired", "$total"] }, 100] }] },
                            0
                        ]
                    }
                }
            },
            { $sort: { percent: -1 } }
        ]);
        // 🌟 REAL Aggregation: Department Efficiency (Removed dummy fallback)
        // (Calculated above in deptEfficiency)
        // 4. Source Channels (Use real aggregation)
        const sourcesData = await Candidate_1.default.aggregate([
            { $match: { companyId } },
            {
                $group: {
                    _id: { $ifNull: ["$source", "Direct"] },
                    count: { $sum: 1 }
                }
            }
        ]);
        const sources = sourcesData.map(s => ({
            label: s._id,
            raw: s.count,
            val: totalCandidates > 0 ? `${Math.round((s.count / totalCandidates) * 100)}%` : "0%"
        }));
        if (sources.length === 0) {
            sources.push({ label: 'Direct', raw: 0, val: '0%' });
        }
        // 5. Top Interviewers
        let topInterviewersData = await Interview_1.default.aggregate([
            { $match: { companyId, status: "Completed" } },
            {
                $group: {
                    _id: "$interviewerId",
                    count: { $sum: 1 },
                    avgScore: { $avg: "$score" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ]);
        let topInterviewers = topInterviewersData.map(interviewer => ({
            name: interviewer.user.name,
            hits: interviewer.count,
            eff: `${Math.round((interviewer.count / (interviewer.count + 2)) * 100)}%`,
            rating: Math.round(interviewer.avgScore) || 0,
            seed: interviewer.user.name.split(' ')[0].toLowerCase()
        }));
        // 🌟 REAL Velocity (No dummy fallback)
        const hasVelocity = velocity.some(v => v.value > 0);
        const finalVelocity = velocity;
        res.json({
            coreMetrics: [
                { label: 'Total Hires', val: totalHires.toString(), growth: '+0%', icon: 'Users' },
                { label: 'Avg. Time to Hire', val: `${avgTimeToHire}d`, growth: '+0%', icon: 'Clock' },
                { label: 'Offer Acceptance', val: `${offerAcceptanceRate}%`, growth: '+0%', icon: 'UserCheck' },
                { label: 'Active Pipeline', val: activePipeline.toString(), growth: '+0%', icon: 'TrendingUp' },
            ],
            velocity: finalVelocity,
            deptEfficiency,
            sources,
            topInterviewers,
            totalCandidates
        });
    }
    catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getAnalytics = getAnalytics;
