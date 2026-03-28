import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Notification from "../models/Notification";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
