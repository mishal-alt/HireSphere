'use client';
import { useEffect } from 'react';
import { socketService } from '@/services/socket';
import { toast } from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function NotificationListener() {
    const { user } = useAuth();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (user?._id) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                // Connect the socket if not already connected
                const socket = socketService.connect(token);
                
                if (socket) {
                    // Join the private user room
                    socketService.registerUser(user._id);
                    
                    // Join the company-wide room for shared notifications
                    if (user.companyId) {
                        socketService.joinRoom(user.companyId);
                    }

                    // Listen for notifications
                    socket.off('notification_received'); // Clean up existing listeners
                    socket.on('notification_received', (data: any) => {
                        // Add to store
                        addNotification({
                            _id: data._id || Math.random().toString(36).substring(7), // Use real ID if available
                            title: data.title,
                            message: data.message,
                            type: data.type || 'info',
                            isRead: data.isRead || false,
                            createdAt: data.createdAt || new Date().toISOString()
                        });
                        
                        toast(data.message, {
                            icon: '🔔',
                            duration: 5000,
                            position: 'top-right',
                            style: {
                                background: '#1e293b',
                                color: '#fff',
                                borderRadius: '1rem',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '16px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }
                        });
                    });
                }
            }
        }

        return () => {
            const socket = socketService.getSocket();
            if (socket) {
                socket.off('notification_received');
            }
        };
    }, [user?._id]);

    return null;
}
