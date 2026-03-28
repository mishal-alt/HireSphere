import { Request, Response } from "express";
import Job from "../models/Job";
import Candidate from "../models/Candidate";
import User, { UserRole } from "../models/User";
import cloudinary from "../config/cloudinary";
import { sendNotification } from "../utils/notificationUtils";

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

        // Handle File Upload to Cloudinary
        if (req.file) {
            const file = req.file;
            const publicId = `${name.replace(/\s+/g, "_")}_${Date.now()}`;

            const uploadResult: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image", // Cloudinary treats PDFs as images for upload_stream usually or needs resource_type: 'auto'
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
            status: "New"
        });

        // Notify Admins of the company
        const io = req.app.get('io');
        if (!io) {
            console.warn('[PublicController] Socket.io (io) not found in req.app');
        }

        const admins = await User.find({ companyId, role: UserRole.ADMIN });
        console.log(`[PublicController] Found ${admins.length} admins for company: ${companyId}`);

        const job = await Job.findById(jobId);

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
