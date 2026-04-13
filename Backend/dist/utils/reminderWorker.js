"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initReminderWorker = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Interview_1 = __importDefault(require("../models/Interview"));
const emailService_1 = require("./emailService");
const notificationUtils_1 = require("./notificationUtils");
/**
 * Interview Reminder Bot
 * Runs every hour to check for upcoming sessions (within 24 hours)
 */
const initReminderWorker = (io) => {
    // Run every hour on the hour
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("[ReminderWorker] Running scheduled interview scan...");
        try {
            const tomorrow = new Date();
            tomorrow.setHours(tomorrow.getHours() + 24);
            // Find 'Scheduled' interviews happening in the next 24 hours 
            const upcomingInterviews = await Interview_1.default.find({
                status: "Scheduled",
                scheduledAt: {
                    $gte: new Date(),
                    $lte: tomorrow
                }
            }).populate("candidateId interviewerId");
            console.log(`[ReminderWorker] Found ${upcomingInterviews.length} upcoming sessions.`);
            for (const interview of upcomingInterviews) {
                const candidate = interview.candidateId;
                const interviewer = interview.interviewerId;
                if (!candidate || !interviewer)
                    continue;
                const interviewDate = new Date(interview.scheduledAt).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                });
                const startTime = new Date(interview.scheduledAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit'
                });
                // 🔔 Socket Notification for Interviewer
                await (0, notificationUtils_1.sendNotification)(io, interviewer._id.toString(), {
                    title: "Upcoming Interview Reminder",
                    message: `Your interview with ${candidate.name} is scheduled for ${interviewDate} at ${startTime}.`,
                    type: "meeting_reminder",
                    metadata: { interviewId: interview._id }
                });
                // 📧 Remind Candidate
                await (0, emailService_1.sendInterviewReminder)(candidate.email, candidate.name, interviewDate, startTime, `${process.env.FRONTEND_URL || 'http://localhost:3000'}${interview.meetLink}`, 'candidate');
                // 📧 Remind Interviewer
                await (0, emailService_1.sendInterviewReminder)(interviewer.email, candidate.name, interviewDate, startTime, `${process.env.FRONTEND_URL || 'http://localhost:3000'}${interview.meetLink}`, 'interviewer');
            }
        }
        catch (error) {
            console.error("[ReminderWorker] Error during scan:", error);
        }
    });
    console.log("[ReminderWorker] System initialized (Hourly Scan)");
};
exports.initReminderWorker = initReminderWorker;
