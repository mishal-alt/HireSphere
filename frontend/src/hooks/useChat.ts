import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { socketService } from '@/services/socket';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    isRead: boolean;
}

interface Conversation {
    _id: string;
    participants: any[];
    lastMessage?: Message;
    updatedAt: string;
}

export const useChat = (conversationId?: string) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    // 1. Fetch all conversations for the sidebar
    const conversationsQuery = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const { data } = await api.get('/chat/conversations');
            return data.conversations as Conversation[];
        },
        enabled: !!user
    });

    // 2. Fetch messages for the selected conversation
    const messagesQuery = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            if (!conversationId) return [];
            const { data } = await api.get(`/chat/messages/${conversationId}`);
            return data.messages as Message[];
        },
        enabled: !!conversationId
    });

    // 3. Real-time message listener via Socket.io
    useEffect(() => {
        if (!user) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const socket = socketService.connect(token);

        if (conversationId) {
            socket.emit('join_room', conversationId);
            socket.emit('mark_read', { conversationId, readerId: user._id });
        }

        socket.on('receive_message', (newMessage: Message) => {
            // Update message list in cache if it's for the current conversation
            if (newMessage.conversationId === conversationId) {
                queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => {
                    // Avoid duplicate messages
                    if (old.find(m => m._id === newMessage._id)) return old;
                    return [...old, newMessage];
                });

                // If we are in the room, mark incoming messages as read
                if (newMessage.senderId !== user._id) {
                    socket.emit('mark_read', { conversationId, readerId: user._id });
                }
            }

            // Invalidate conversations list to update sidebar (last message)
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });

        socket.on('messages_read', ({ conversationId: readConvId, readerId }) => {
            if (readConvId === conversationId && readerId !== user._id) {
                // If someone else read messages in current conversation, update our local view
                queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => {
                    return old.map(m => m.senderId === user._id ? { ...m, isRead: true } : m);
                });
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('messages_read');
        };
    }, [conversationId, queryClient, user]);

    // 4. Send Message Mutation
    const sendMessage = useMutation({
        mutationFn: async ({ content, receiverId }: { content: string; receiverId: string }) => {
            const socket = socketService.getSocket();
            if (socket && user) {
                socket.emit('send_message', {
                    conversationId,
                    senderId: user._id,
                    content,
                    companyId: user.companyId,
                    receiverId
                });
            }
        }
    });

    // 5. Create Conversation Mutation
    const createConversation = useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await api.post('/chat/conversation', { participantId });
            return data.conversation as Conversation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });

    return {
        conversations: conversationsQuery.data || [],
        messages: messagesQuery.data || [],
        isLoadingConversations: conversationsQuery.isLoading,
        isLoadingMessages: messagesQuery.isLoading,
        sendMessage: sendMessage.mutate,
        isSending: sendMessage.isPending,
        createConversation: createConversation.mutateAsync,
        isCreating: createConversation.isPending
    };
};
