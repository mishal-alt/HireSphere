import { Response } from "express";
import { Readable } from "stream";
import Candidate from "../models/Candidate";
import { AuthRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";

// Create Candidate with Resume
export const createCandidate = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { name, email, phone } = req.body;

        // 1. Validation
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized: Company ID missing" });
        }

        const companyId = req.user.companyId;

        // 2. Check for existing candidate in this company
        const existingCandidate = await Candidate.findOne({ email, companyId });
        if (existingCandidate) {
            return res.status(400).json({ message: "Candidate with this email already exists" });
        }

        let resumeUrl = "";

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

            const uploadResult: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: `hiresphere/${companyId}/resumes`,
                        public_id: publicId,     // 👈 ADD THIS
                        type: "upload"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(file.buffer);
            });

            // 🔹 Cloudinary will now provide a valid URL that browsers can display
            resumeUrl = uploadResult.secure_url;
        }

        // 4. Create candidate
        const candidate = await Candidate.create({
            name,
            email,
            phone,
            resumeUrl,
            companyId,
        });

        return res.status(201).json(candidate);
    } catch (error: any) {
        console.error("Create Candidate Error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getCandidates = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const candidates = await Candidate.find({
            companyId: req.user.companyId,
        }).sort({ createdAt: -1 }); // Newest first

        return res.json(candidates);
    } catch (error) {
        console.error("Get Candidates Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateCandidate = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, email, phone } = req.body;

        const candidate = await Candidate.findOne({
            _id: req.params.id,
            companyId: req.user.companyId,
        });

        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });

        // Update fields
        if (name) candidate.name = name;
        if (email) candidate.email = email;
        if (phone) candidate.phone = phone;

        await candidate.save();

        return res.json(candidate);
    } catch (error) {
        console.error("Update Candidate Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const deleteCandidate = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user || !req.user.companyId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const candidate = await Candidate.findOneAndDelete({
            _id: req.params.id,
            companyId: req.user.companyId,
        });

        if (!candidate)
            return res.status(404).json({ message: "Candidate not found" });

        return res.json({ message: "Candidate deleted successfully" });
    } catch (error) {
        console.error("Delete Candidate Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};