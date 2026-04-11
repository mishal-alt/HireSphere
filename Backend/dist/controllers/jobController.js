"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const Company_1 = __importDefault(require("../models/Company"));
const mongoose_1 = __importDefault(require("mongoose"));
const getJobs = async (req, res) => {
    try {
        const companyId = new mongoose_1.default.Types.ObjectId(req.user.companyId);
        const jobsWithCounts = await Job_1.default.aggregate([
            { $match: { companyId } },
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applicants"
                }
            },
            {
                $project: {
                    title: 1,
                    department: 1,
                    description: 1,
                    status: 1,
                    requiredSkills: 1,
                    companyId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    applicantCount: { $size: "$applicants" }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.json(jobsWithCounts);
    }
    catch (error) {
        console.error("Fetch Jobs Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getJobs = getJobs;
const createJob = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        // 1. Fetch Company Plan
        const company = await Company_1.default.findById(companyId);
        if (!company)
            return res.status(404).json({ message: "Company not found" });
        // 2. Count Active Jobs
        const activeJobCount = await Job_1.default.countDocuments({ companyId, status: "active" });
        // 3. Check Limits
        const plan = company.subscriptionPlan;
        if (plan === "free" && activeJobCount >= 5) {
            return res.status(403).json({ message: "Limit Reached: Free plans are limited to 5 active jobs. Please upgrade to Premium." });
        }
        if (plan === "premium" && activeJobCount >= 50) {
            return res.status(403).json({ message: "Limit Reached: Premium plans are limited to 50 active jobs. Please upgrade to Pro." });
        }
        const { title, department, description, requiredSkills } = req.body;
        const job = await Job_1.default.create({
            title,
            department,
            description,
            requiredSkills: requiredSkills || [],
            companyId,
        });
        res.status(201).json(job);
        // Emit notification to the company room
        const io = req.app.get('io');
        if (io) {
            console.log(`[JobController] New job created, emitting to company room: ${req.user.companyId}`);
            io.to(req.user.companyId).emit('notification_received', {
                title: 'New Opening!',
                message: `New Job Opportunity: ${job.title} has been posted!`,
                type: 'job_created',
                metadata: { jobId: job._id }
            });
        }
        else {
            console.warn('[JobController] Could not find socket.io instance in req.app');
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const job = await Job_1.default.findOneAndUpdate({ _id: id, companyId: req.user.companyId }, updates, { new: true });
        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job_1.default.findOneAndDelete({ _id: id, companyId: req.user.companyId });
        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }
        res.json({ message: "Job deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteJob = deleteJob;
