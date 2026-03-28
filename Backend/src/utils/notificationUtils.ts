import Notification from "../models/Notification";
import { Server } from "socket.io";

export const sendNotification = async (
  io: Server, 
  userId: string, 
  data: { title: string, message: string, type?: string, metadata?: any }
) => {
  try {
    console.log(`[NotificationService] Attempting to send notification to user: ${userId}`);

    // 1. Save to Database
    const newNotification = await Notification.create({
      userId,
      title: data.title,
      message: data.message,
      type: data.type || "info",
      metadata: data.metadata,
    });

    // 2. Emit via Socket.io
    if (io) {
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
    } else {
      console.warn(`[NotificationService] Socket.io instance (io) is missing! Notification was saved to DB but not emitted.`);
    }

  } catch (error) {
    console.error("[NotificationService] Error sending notification:", error);
  }
};

