import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Job from "../models/Job";

export const getJobs = async (req: AuthRequest, res: Response) => {
    try {
        const jobs = await Job.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        const { title, department, description } = req.body;
        const job = await Job.create({
            title,
            department,
            description,
            companyId: req.user.companyId,
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
        } else {
            console.warn('[JobController] Could not find socket.io instance in req.app');
        }

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const job = await Job.findOneAndUpdate(
            { _id: id, companyId: req.user.companyId },
            updates,
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOneAndDelete({ _id: id, companyId: req.user.companyId });

        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
