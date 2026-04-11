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
exports.getInterviewDetails = exports.signOffer = exports.getOfferDetails = exports.submitApplication = exports.getPublicJobById = exports.getPublicJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const Candidate_1 = __importDefault(require("../models/Candidate"));
const User_1 = __importStar(require("../models/User"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const notificationUtils_1 = require("../utils/notificationUtils");
const resumeParser_1 = require("../utils/resumeParser");
const Company_1 = __importDefault(require("../models/Company"));
// Fetch all active jobs for a specific company
const getPublicJobs = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company_1.default.findById(companyId).select("name logoUrl");
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const jobs = await Job_1.default.find({ companyId, status: "Active" }).sort({ createdAt: -1 });
        res.json({
            companyName: company.name,
            companyLogo: company.logoUrl,
            jobs
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getPublicJobs = getPublicJobs;
// Fetch details for a specific job
const getPublicJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log("Fetching job details for jobId:", jobId);
        // Basic validation for MongoDB ObjectId
        if (!jobId || typeof jobId !== "string" || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn("Invalid jobId format received:", jobId);
            return res.status(400).json({ message: "Invalid Job ID format" });
        }
        const job = await Job_1.default.findById(jobId).populate("companyId", "name logoUrl");
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    }
    catch (error) {
        console.error("Fetch Job Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.getPublicJobById = getPublicJobById;
// Submit a candidate application
const submitApplication = async (req, res) => {
    try {
        const { name, email, phone, experience, education, jobId, companyId } = req.body;
        if (!name || !email || !jobId || !companyId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Validate IDs
        if (typeof jobId !== "string" || !jobId.match(/^[0-9a-fA-F]{24}$/) ||
            typeof companyId !== "string" || !companyId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        // Check if candidate already applied for THIS job in THIS company
        const existingCandidate = await Candidate_1.default.findOne({ email, companyId, jobId });
        if (existingCandidate) {
            return res.status(400).json({ message: "You have already applied for this position." });
        }
        let resumeUrl = "";
        let atsScore = 0;
        let matchedSkills = [];
        let resumeText = "";
        let status = "New";
        const job = await Job_1.default.findById(jobId);
        const requiredSkills = job?.requiredSkills || [];
        // Handle File Upload to Cloudinary
        if (req.file) {
            const file = req.file;
            const publicId = `${name.replace(/\s+/g, "_")}_${Date.now()}`;
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: "auto",
                    folder: `hiresphere/${companyId}/public_applications`,
                    public_id: publicId,
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end(file.buffer);
            });
            resumeUrl = uploadResult.secure_url;
            // --- ATS SCORING LOGIC ---
            try {
                console.log(`[Public Application] Running ATS for Job ID: ${jobId}, Required Skills found:`, requiredSkills);
                const parsedResult = await (0, resumeParser_1.parseResume)(file.buffer, requiredSkills);
                atsScore = parsedResult.atsScore;
                matchedSkills = parsedResult.matchedSkills;
                resumeText = parsedResult.resumeText;
                if (requiredSkills.length > 0) {
                    if (atsScore >= 70) {
                        status = "Shortlisted";
                    }
                    else {
                        status = "Rejected";
                    }
                }
            }
            catch (err) {
                console.error("Public Application Resume parsing error:", err);
            }
        }
        // Create the candidate record
        const candidate = await Candidate_1.default.create({
            name,
            email,
            phone,
            experience,
            education,
            resumeUrl,
            companyId,
            jobId,
            atsScore,
            matchedSkills,
            resumeText,
            status: status
        });
        // Notify Admins of the company
        const io = req.app.get('io');
        if (!io) {
            console.warn('[PublicController] Socket.io (io) not found in req.app');
        }
        const admins = await User_1.default.find({ companyId, role: User_1.UserRole.ADMIN });
        console.log(`[PublicController] Found ${admins.length} admins for company: ${companyId}`);
        for (const admin of admins) {
            console.log(`[PublicController] Attempting to notify admin: ${admin.name} (${admin._id})`);
            await (0, notificationUtils_1.sendNotification)(io, admin._id.toString(), {
                title: 'New Application!',
                message: `${name} just applied for the ${job?.title || 'Job'} position.`,
                type: 'candidate_created',
                metadata: { candidateId: candidate._id, jobId }
            });
        }
        res.status(201).json({ message: "Application submitted successfully", candidateId: candidate._id });
    }
    catch (error) {
        console.error("Public Application Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.submitApplication = submitApplication;
const signatureService_1 = require("../services/signatureService");
// Fetch offer details for the candidate signature page
const getOfferDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await Candidate_1.default.findById(id).populate("companyId", "name logoUrl");
        if (!candidate || candidate.status !== "Offered") {
            return res.status(404).json({ message: "Offer not found or already processed." });
        }
        res.json({
            candidateName: candidate.name,
            companyName: candidate.companyId?.name || "HireSphere Partner",
            companyLogo: candidate.companyId?.logoUrl,
            offerLetterUrl: candidate.offerLetterUrl,
            status: candidate.status
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getOfferDetails = getOfferDetails;
// Candidate signatures the offer
const signOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const { signatureData } = req.body; // Base64 PNG from signature pad
        if (!signatureData) {
            return res.status(400).json({ message: "Signature drawing is required" });
        }
        const candidate = await Candidate_1.default.findById(id);
        if (!candidate || candidate.status !== "Offered") {
            return res.status(404).json({ message: "Offer process invalid or already completed." });
        }
        const forwarded = req.headers["x-forwarded-for"];
        const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded) || req.socket.remoteAddress || "Unknown";
        const userAgent = req.headers["user-agent"] || "Unknown";
        // Complete the signature
        const updatedCandidate = await (0, signatureService_1.applyInHouseSignature)(id, signatureData, {
            ip,
            userAgent,
        });
        // Notify Admins
        const io = req.app.get('io');
        const admins = await User_1.default.find({ companyId: candidate.companyId, role: User_1.UserRole.ADMIN });
        for (const admin of admins) {
            await (0, notificationUtils_1.sendNotification)(io, admin._id.toString(), {
                title: 'Offer Signed! 🎉',
                message: `${candidate.name} has officially signed their offer letter.`,
                type: 'candidate_hired',
                metadata: { candidateId: candidate._id }
            });
        }
        res.json({ message: "Offer signed successfully!", candidate: updatedCandidate });
    }
    catch (error) {
        console.error("Sign Offer Error:", error);
        res.status(500).json({ message: error.message || "Signature failed." });
    }
};
exports.signOffer = signOffer;
const Interview_1 = __importDefault(require("../models/Interview"));
// Fetch interview details for the candidate video room
const getInterviewDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview_1.default.findById(id)
            .populate("candidateId", "name email")
            .populate("companyId", "name logoUrl");
        if (!interview) {
            return res.status(404).json({ message: "Interview session not found." });
        }
        res.json({
            interviewTitle: interview.title || "Technical Interview",
            candidateName: interview.candidateId?.name,
            companyName: interview.companyId?.name,
            companyLogo: interview.companyId?.logoUrl,
            scheduledAt: interview.scheduledAt,
            status: interview.status
        });
    }
    catch (error) {
        console.error("Public Get Interview Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getInterviewDetails = getInterviewDetails;
