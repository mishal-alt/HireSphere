import { Request, Response } from "express";
import Job from "../models/Job";
import Candidate from "../models/Candidate";
import User, { UserRole } from "../models/User";
import cloudinary from "../config/cloudinary";
import { sendNotification } from "../utils/notificationUtils";
import { parseResume } from "../utils/resumeParser";

import Company from "../models/Company";

// Fetch all active jobs for a specific company
export const getPublicJobs = async (req: Request, res: Response) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId).select("name logoUrl");

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const jobs = await Job.find({ companyId, status: "Active" }).sort({ createdAt: -1 });

        res.json({
            companyName: company.name,
            companyLogo: company.logoUrl,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Fetch details for a specific job
export const getPublicJobById = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        console.log("Fetching job details for jobId:", jobId);

        // Basic validation for MongoDB ObjectId
        if (!jobId || typeof jobId !== "string" || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn("Invalid jobId format received:", jobId);
            return res.status(400).json({ message: "Invalid Job ID format" });
        }

        const job = await Job.findById(jobId).populate("companyId", "name logoUrl");
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    } catch (error: any) {
        console.error("Fetch Job Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Submit a candidate application
export const submitApplication = async (req: Request, res: Response) => {
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
        const existingCandidate = await Candidate.findOne({ email, companyId, jobId });
        if (existingCandidate) {
            return res.status(400).json({ message: "You have already applied for this position." });
        }

        let resumeUrl = "";
        let atsScore = 0;
        let matchedSkills: string[] = [];
        let resumeText = "";
        let status = "New";

        const job = await Job.findById(jobId);
        const requiredSkills = job?.requiredSkills || [];

        // Handle File Upload to Cloudinary
        if (req.file) {
            const file = req.file;
            const publicId = `${name.replace(/\s+/g, "_")}_${Date.now()}`;

            const uploadResult: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto", 
                        folder: `hiresphere/${companyId}/public_applications`,
                        public_id: publicId,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
            resumeUrl = uploadResult.secure_url;

            // --- ATS SCORING LOGIC ---
            try {
                console.log(`[Public Application] Running ATS for Job ID: ${jobId}, Required Skills found:`, requiredSkills);
                const parsedResult = await parseResume(file.buffer, requiredSkills);
                atsScore = parsedResult.atsScore;
                matchedSkills = parsedResult.matchedSkills;
                resumeText = parsedResult.resumeText;

                if (requiredSkills.length > 0) {
                    if (atsScore >= 70) {
                        status = "Shortlisted";
                    } else {
                        status = "Rejected";
                    }
                }
            } catch (err) {
                console.error("Public Application Resume parsing error:", err);
            }
        }

        // Create the candidate record
        const candidate = await Candidate.create({
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
            status: status as any
        });

        // Notify Admins of the company
        const io = req.app.get('io');
        if (!io) {
            console.warn('[PublicController] Socket.io (io) not found in req.app');
        }

        const admins = await User.find({ companyId, role: UserRole.ADMIN });
        console.log(`[PublicController] Found ${admins.length} admins for company: ${companyId}`);

        for (const admin of admins) {
            console.log(`[PublicController] Attempting to notify admin: ${admin.name} (${admin._id})`);
            await sendNotification(io, admin._id.toString(), {
                title: 'New Application!',
                message: `${name} just applied for the ${job?.title || 'Job'} position.`,
                type: 'candidate_created',
                metadata: { candidateId: candidate._id, jobId }
            });
        }

        res.status(201).json({ message: "Application submitted successfully", candidateId: candidate._id });
    } catch (error: any) {
        console.error("Public Application Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
import { handleSignatureComplete } from "../services/signatureService";

// Fetch offer details for the candidate signature page
export const getOfferDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const candidate = await Candidate.findById(id).populate("companyId", "name logoUrl");

        if (!candidate || candidate.status !== "Offered") {
            return res.status(404).json({ message: "Offer not found or already processed." });
        }

        res.json({
            candidateName: candidate.name,
            companyName: (candidate.companyId as any)?.name || "HireSphere Partner",
            companyLogo: (candidate.companyId as any)?.logoUrl,
            offerLetterUrl: (candidate as any).offerLetterUrl,
            status: candidate.status
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Candidate signatures the offer
export const signOffer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { signatureName } = req.body;

        if (!signatureName) {
            return res.status(400).json({ message: "Legal signature name is required" });
        }

        const candidate = await Candidate.findById(id);
        if (!candidate || !candidate.signatureId) {
            return res.status(404).json({ message: "Active signature request not found." });
        }

        // Complete the signature
        const updatedCandidate = await handleSignatureComplete(candidate.signatureId);

        // Notify Admins
        const io = req.app.get('io');
        const admins = await User.find({ companyId: candidate.companyId, role: UserRole.ADMIN });
        
        for (const admin of admins) {
            await sendNotification(io, admin._id.toString(), {
                title: 'Offer Signed! 🎉',
                message: `${candidate.name} has officially signed their offer for ${signatureName}.`,
                type: 'candidate_hired',
                metadata: { candidateId: candidate._id }
            });
        }

        res.json({ message: "Offer signed successfully!", candidate: updatedCandidate });
    } catch (error) {
        res.status(500).json({ message: "Signature failed." });
    }
};
import Interview from "../models/Interview";

// Fetch interview details for the candidate video room
export const getInterviewDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id)
            .populate("candidateId", "name email")
            .populate("companyId", "name logoUrl");

        if (!interview) {
            return res.status(404).json({ message: "Interview session not found." });
        }

        res.json({
            interviewTitle: (interview as any).title || "Technical Interview",
            candidateName: (interview.candidateId as any)?.name,
            companyName: (interview.companyId as any)?.name,
            companyLogo: (interview.companyId as any)?.logoUrl,
            scheduledAt: interview.scheduledAt,
            status: interview.status
        });
    } catch (error) {
        console.error("Public Get Interview Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
