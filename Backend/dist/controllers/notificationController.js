"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification_1.default.findByIdAndUpdate(id, { isRead: true });
        res.json({ message: "Notification marked as read" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification_1.default.updateMany({ userId, isRead: false }, { isRead: true });
        res.json({ message: "All notifications marked as read" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.markAllAsRead = markAllAsRead;
