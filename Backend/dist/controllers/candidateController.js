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
exports.rejectCandidate = exports.hireCandidate = exports.generateOfferLetter = exports.sendMessage = exports.getCandidateById = exports.deleteCandidate = exports.updateCandidate = exports.getCandidates = exports.createCandidate = void 0;
const Candidate_1 = __importDefault(require("../models/Candidate"));
const User_1 = __importStar(require("../models/User"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const notificationUtils_1 = require("../utils/notificationUtils");
const resumeParser_1 = require("../utils/resumeParser");
const Job_1 = __importDefault(require("../models/Job"));
const Interview_1 = __importDefault(require("../models/Interview"));
const Company_1 = __importDefault(require("../models/Company"));
const emailService_1 = require("../utils/emailService");
const quotaService_1 = require("../services/quotaService");
const pdfService_1 = require("../services/pdfService");
const signatureService_1 = require("../services/signatureService");
// Create Candidate with Resume
const createCandidate = async (req, res) => {
    try {
        const { name, email, phone, experience, education, jobId } = req.body;
        // 1. Validation
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized: Company ID missing" });
        }
        const companyId = req.user.companyId;
        // 2. Check for existing candidate in this company
        const existingCandidate = await Candidate_1.default.findOne({ email, companyId });
        if (existingCandidate) {
            return res.status(400).json({ message: "Candidate with this email already exists" });
        }
        let resumeUrl = "";
        let atsScore = 0;
        let matchedSkills = [];
        let resumeText = "";
        let status = "New";
        // 3. Handle File Upload
        if (req.file) {
            const file = req.file;
            // Basic mime type check for security
            if (file.mimetype !== 'application/pdf' && !file.mimetype.startsWith('image/')) {
                // If format is forced to pdf, we should probably stick to it or allow images too
                // For now, let's just log and continue or restrict
            }
            const originalName = file.originalname;
            const isPDF = file.mimetype === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');
            const publicId = originalName.replace(/\s+/g, "_").split(".")[0] + "_" + Date.now();
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: "auto",
                    folder: `hiresphere/${companyId}/resumes`,
                    public_id: publicId, // 👈 ADD THIS
                    type: "upload"
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end(file.buffer);
            });
            // 🔹 Cloudinary will now provide a valid URL that browsers can display
            resumeUrl = uploadResult.secure_url;
            // --- ATS SCORING LOGIC (Premium/Pro ONLY) ---
            const company = await Company_1.default.findById(companyId);
            const canUseATS = company?.subscriptionPlan === 'premium' || company?.subscriptionPlan === 'pro';
            if (canUseATS) {
                let requiredSkills = [];
                if (jobId) {
                    const job = await Job_1.default.findById(jobId);
                    if (job && job.requiredSkills) {
                        requiredSkills = job.requiredSkills;
                    }
                }
                // Run the parsing utility
                try {
                    const parsedResult = await (0, resumeParser_1.parseResume)(file.buffer, requiredSkills);
                    atsScore = parsedResult.atsScore;
                    matchedSkills = parsedResult.matchedSkills;
                    resumeText = parsedResult.resumeText;
                    // Threshold logic (High score = Shortlisted)
                    if (requiredSkills.length > 0 && atsScore >= 70) {
                        status = "Shortlisted";
                    }
                }
                catch (err) {
                    console.error("Resume parsing error:", err);
                }
            }
            else {
                console.log(`[ATS Bypass] Account ${companyId} is on ${company?.subscriptionPlan} plan. Skipping scoring.`);
            }
            // ------------------------
        }
        // 4. Create candidate
        const candidate = await Candidate_1.default.create({
            name,
            email,
            phone,
            experience,
            education,
            resumeUrl,
            companyId,
            jobId: jobId || undefined,
            atsScore,
            matchedSkills,
            resumeText,
            status: status
        });
        // NOTIFY ALL ADMINS
        const io = req.app.get('io');
        const admins = await User_1.default.find({
            companyId,
            role: User_1.UserRole.ADMIN,
            _id: { $ne: req.user._id }
        });
        for (const admin of admins) {
            await (0, notificationUtils_1.sendNotification)(io, admin._id.toString(), {
                title: 'New Candidate',
                message: `${name} has been added to the candidate list.`,
                type: 'candidate_created',
                metadata: { candidateId: candidate._id }
            });
        }
        return res.status(201).json(candidate);
    }
    catch (error) {
        console.error("Create Candidate Error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.createCandidate = createCandidate;
const getCandidates = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { status, search } = req.query;
        let andConditions = [{ companyId: req.user.companyId }];
        if (status && status !== 'All') {
            if (status === 'Rejected') {
                andConditions.push({
                    $or: [
                        { status: 'Rejected' },
                        { status: 'New', atsScore: { $lt: 70 } }
                    ]
                });
            }
            else if (status === 'New') {
                andConditions.push({ status: 'New', atsScore: { $gte: 70 } });
            }
            else if (status === 'Hired') {
                // Return both legacy "Hired" and new "Hired (Signed)"
                andConditions.push({ status: { $in: ['Hired', 'Hired (Signed)'] } });
            }
            else {
                andConditions.push({ status: status });
            }
        }
        if (search) {
            andConditions.push({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            });
        }
        let candidates = await Candidate_1.default.find({ $and: andConditions })
            .populate("jobId", "title");
        // Custom sort logic: Shortlisted first, Rejected last
        const statusPriority = {
            'Shortlisted': 1,
            'Scheduled': 2,
            'Interviewed': 3,
            'New': 4,
            'Offered': 5,
            'Hired': 6,
            'Hired (Signed)': 6,
            'Rejected': 7
        };
        candidates.sort((a, b) => {
            const priorityA = statusPriority[a.status] || 99;
            const priorityB = statusPriority[b.status] || 99;
            if (priorityA !== priorityB)
                return priorityA - priorityB;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return res.json(candidates);
    }
    catch (error) {
        console.error("Get Candidates Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getCandidates = getCandidates;
const updateCandidate = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, email, phone, experience, education } = req.body;
        const candidate = await Candidate_1.default.findOne({
            _id: req.params.id,
            companyId: req.user.companyId,
        });
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });
        // Update fields
        if (name)
            candidate.name = name;
        if (email)
            candidate.email = email;
        if (phone)
            candidate.phone = phone;
        if (experience)
            candidate.experience = experience;
        if (education)
            candidate.education = education;
        await candidate.save();
        return res.json(candidate);
    }
    catch (error) {
        console.error("Update Candidate Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.updateCandidate = updateCandidate;
const deleteCandidate = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const candidate = await Candidate_1.default.findOneAndDelete({
            _id: req.params.id,
            companyId: req.user.companyId,
        });
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });
        return res.json({ message: "Candidate deleted successfully" });
    }
    catch (error) {
        console.error("Delete Candidate Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteCandidate = deleteCandidate;
const getCandidateById = async (req, res) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const candidate = await Candidate_1.default.findOne({
            _id: req.params.id,
            companyId: req.user.companyId,
        });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        // 🚀 Fetch associated interviews with full evaluation data
        const interviews = await Interview_1.default.find({ candidateId: candidate._id })
            .populate("interviewerId", "name email")
            .sort({ scheduledAt: -1 })
            .lean(); // 👈 USE .lean() for clean data
        return res.json({
            ...candidate.toObject(),
            interviews
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getCandidateById = getCandidateById;
const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // --- CHECK QUOTA ---
        const quota = await (0, quotaService_1.checkAndIncrementEmailQuota)(req.user.companyId);
        if (!quota.allowed) {
            return res.status(403).json({ message: quota.message });
        }
        // -------------------
        if (!message) {
            return res.status(400).json({ message: "Message content is required" });
        }
        const candidate = await Candidate_1.default.findOne({
            _id: id,
            companyId: req.user.companyId,
        });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        // 📩 Send the actual Email
        await (0, emailService_1.sendCandidateEmail)(candidate.email, `Regarding your application - HireSphere`, message, candidate.name, "HireSphere Recruitment");
        // 🔔 Notify the logs or other admins if needed
        // ...
        return res.json({ message: "Email sent successfully to candidate" });
    }
    catch (error) {
        console.error("Send Message Error:", error);
        return res.status(500).json({
            message: "Failed to send email",
            error: error.message
        });
    }
};
exports.sendMessage = sendMessage;
// 🚀 GENERATE OFFER LETTER
const generateOfferLetter = async (req, res) => {
    try {
        const { id } = req.params;
        const { salary, joiningDate } = req.body;
        if (!salary || !joiningDate) {
            return res.status(400).json({ message: "Salary and Joining Date are required" });
        }
        // --- CHECK QUOTA ---
        const quota = await (0, quotaService_1.checkAndIncrementEmailQuota)(req.user.companyId);
        if (!quota.allowed) {
            return res.status(403).json({ message: quota.message });
        }
        // -------------------
        const candidate = await Candidate_1.default.findOne({ _id: id, companyId: req.user.companyId })
            .populate("jobId", "title");
        const company = await User_1.default.findById(req.user.id).populate("companyId", "name");
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });
        // Generate PDF
        const pdfBuffer = await (0, pdfService_1.generateOfferPDF)({
            candidateName: candidate.name,
            jobTitle: candidate.jobId?.title || "Software Professional",
            salary: Number(salary),
            startDate: new Date(joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            adminName: req.user.name,
            companyName: company?.companyId?.name || "HireSphere Partner"
        });
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({
                resource_type: "raw", // PDFs are raw files
                folder: `hiresphere/${req.user.companyId}/offers`,
                public_id: `offer_${candidate.name.replace(/\s+/g, "_")}_${Date.now()}`,
                format: "pdf"
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(pdfBuffer);
        });
        // 🖋️ Initiate Digital Signature Track
        const signatureId = await (0, signatureService_1.initiateSignatureRequest)(candidate._id.toString(), uploadResult.secure_url);
        // Update Candidate
        candidate.status = "Offered";
        candidate.offeredSalary = Number(salary);
        candidate.joiningDate = new Date(joiningDate);
        candidate.offerLetterUrl = uploadResult.secure_url;
        candidate.signatureId = signatureId;
        await candidate.save();
        // 📧 Send Offer Email
        await (0, emailService_1.sendCandidateEmail)(candidate.email, `Job Offer from ${company?.companyId?.name || "HireSphere Partner"}`, `We are excited to offer you the role of ${candidate.jobId?.title || "Software Professional"}! You can view and sign your offer letter at the link below. Welcome to the journey!`, candidate.name, company?.companyId?.name || "HireSphere Recruitment Team", `${process.env.FRONTEND_URL || 'http://localhost:3000'}/offer/${candidate._id}` // 👈 DYNAMIC LINK
        ).catch(err => console.error("Offer email failed:", err));
        res.json({
            message: "Offer generated and signature request initiated.",
            candidate,
            offerUrl: uploadResult.secure_url,
            signatureId
        });
    }
    catch (error) {
        console.error("Generate Offer Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.generateOfferLetter = generateOfferLetter;
// 🚀 HIRE CANDIDATE (Manual Override)
const hireCandidate = async (req, res) => {
    // ... existing code ...
};
exports.hireCandidate = hireCandidate;
// ❌ REJECT CANDIDATE
const rejectCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await Candidate_1.default.findOne({ _id: id, companyId: req.user.companyId });
        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });
        // --- CHECK QUOTA ---
        const quota = await (0, quotaService_1.checkAndIncrementEmailQuota)(req.user.companyId);
        if (!quota.allowed) {
            return res.status(403).json({ message: quota.message });
        }
        // -------------------
        candidate.status = "Rejected";
        await candidate.save();
        // 📧 Send Rejection Email
        await (0, emailService_1.sendCandidateEmail)(candidate.email, `Update on your application - HireSphere`, `Thank you for your interest in the position and for taking the time to interview with us. After careful consideration, we have decided to move forward with other candidates at this time. We wish you the very best in your professional journey.`, candidate.name, "HireSphere Recruitment Team").catch(err => console.error("Rejection email failed:", err));
        res.json({ message: "Candidate status updated to Rejected", candidate });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.rejectCandidate = rejectCandidate;
