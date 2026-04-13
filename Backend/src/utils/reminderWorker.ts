import cron from "node-cron";
import Interview from "../models/Interview";
import { sendInterviewReminder } from "./emailService";
import { sendNotification } from "./notificationUtils";
import { Server } from "socket.io";

/**
 * Interview Reminder Bot
 * Runs every hour to check for upcoming sessions (within 24 hours)
 */
export const initReminderWorker = (io: Server) => {
  // Run every hour on the hour
  cron.schedule("0 * * * *", async () => {
    console.log("[ReminderWorker] Running scheduled interview scan...");
    
    try {
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      
      // Find 'Scheduled' interviews happening in the next 24 hours 
      const upcomingInterviews = await Interview.find({
        status: "Scheduled",
        scheduledAt: { 
          $gte: new Date(), 
          $lte: tomorrow 
        }
      }).populate("candidateId interviewerId");

      console.log(`[ReminderWorker] Found ${upcomingInterviews.length} upcoming sessions.`);

      for (const interview of upcomingInterviews) {
        const candidate = interview.candidateId as any;
        const interviewer = interview.interviewerId as any;

        if (!candidate || !interviewer) continue;

        const interviewDate = new Date(interview.scheduledAt).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        const startTime = new Date(interview.scheduledAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit' 
        });

        // 🔔 Socket Notification for Interviewer
        await sendNotification(io, interviewer._id.toString(), {
          title: "Upcoming Interview Reminder",
          message: `Your interview with ${candidate.name} is scheduled for ${interviewDate} at ${startTime}.`,
          type: "meeting_reminder",
          metadata: { interviewId: interview._id }
        });

        // 📧 Remind Candidate
        await sendInterviewReminder(
          candidate.email,
          candidate.name,
          interviewDate,
          startTime,
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}${interview.meetLink}`,
          'candidate'
        );

        // 📧 Remind Interviewer
        await sendInterviewReminder(
          interviewer.email,
          candidate.name,
          interviewDate,
          startTime,
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}${interview.meetLink}`,
          'interviewer'
        );
      }
    } catch (error) {
      console.error("[ReminderWorker] Error during scan:", error);
    }
  });

  console.log("[ReminderWorker] System initialized (Hourly Scan)");
};
