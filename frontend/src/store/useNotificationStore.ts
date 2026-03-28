import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const notifications = response.data;
            const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
            set({ notifications, unreadCount, loading: false });
        } catch (error) {
            console.error('Fetch notifications error:', error);
            set({ loading: false });
        }
    },

    addNotification: (notification: Notification) => {
        set((state) => {
            const newNotifications = [notification, ...state.notifications];
            return {
                notifications: newNotifications,
                unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
            };
        });
    },

    markAsRead: async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => {
                const newNotifications = state.notifications.map((n) =>
                    n._id === id ? { ...n, isRead: true } : n
                );
                return {
                    notifications: newNotifications,
                    unreadCount: Math.max(0, state.unreadCount - 1)
                };
            });
        } catch (error) {
            console.error('Mark as read error:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Mark all as read error:', error);
        }
    }
}));
