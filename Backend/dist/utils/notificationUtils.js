"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const sendNotification = async (io, userId, data) => {
    try {
        // 0. Check User Preferences
        const user = await User_1.default.findById(userId).select("notificationPreferences");
        if (user && user.notificationPreferences) {
            const typeKeyMap = {
                interview_created: "interviewAssigned",
                chat_message: "recruiterMessage",
                candidate_created: "candidateApplication",
                meeting_reminder: "meetingReminders",
            };
            const type = data.type || "";
            const prefKey = typeKeyMap[type];
            // Check Specific Event Preference
            if (prefKey && !user.notificationPreferences[prefKey]) {
                console.log(`[NotificationService] User ${userId} has disabled ${type}. Skipping DB and Emit.`);
                return;
            }
        }
        console.log(`[NotificationService] Attempting to send notification to user: ${userId}`);
        // 1. Save to Database
        const newNotification = await Notification_1.default.create({
            userId,
            title: data.title,
            message: data.message,
            type: data.type || "info",
            metadata: data.metadata,
        });
        // 2. Emit via Socket.io (only if browser notifications are enabled)
        const browserNotifsEnabled = user?.notificationPreferences?.browserNotifications !== false;
        if (io && browserNotifsEnabled) {
            console.log(`[NotificationService] Emitting socket notification to user room: ${userId}`);
            io.to(userId).emit("notification_received", {
                _id: newNotification._id,
                title: data.title,
                message: data.message,
                type: data.type || "info",
                metadata: data.metadata,
                createdAt: newNotification.createdAt,
                isRead: false
            });
        }
        else if (io && !browserNotifsEnabled) {
            console.log(`[NotificationService] Skipping socket emit for ${userId} (User disabled browser notifications)`);
        }
        else {
            console.warn(`[NotificationService] Socket.io instance (io) is missing! Notification was saved to DB but not emitted.`);
        }
    }
    catch (error) {
        console.error("[NotificationService] Error sending notification:", error);
    }
};
exports.sendNotification = sendNotification;
