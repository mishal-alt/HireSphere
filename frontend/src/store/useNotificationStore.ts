import { create } from 'zustand';
import api from '@/services/api';

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
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/notifications');
            const notifications = response.data;
            const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
            set({ notifications, unreadCount, isLoading: false });
        } catch (error) {
            console.error('Fetch notifications error:', error);
            set({ isLoading: false });
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
            await api.put(`/notifications/${id}/read`);
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
            await api.put('/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Mark all as read error:', error);
        }
    },

    clearAll: async () => {
        try {
            await api.delete('/notifications/clear-all');
            set({ notifications: [], unreadCount: 0 });
        } catch (error) {
            console.error('Clear all notifications error:', error);
        }
    }
}));
