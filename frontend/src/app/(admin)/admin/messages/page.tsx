'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatParticipants } from '@/hooks/useChatParticipants';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function AdminMessagesPage() {
    const { user } = useAuthStore();
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const {
        conversations,
        messages,
        sendMessage,
        createConversation,
        isLoadingConversations,
        isLoadingMessages
    } = useChat(activeConversationId || undefined);

    const { data: participants = [], isLoading: isLoadingParticipants } = useChatParticipants();

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(conversations[0]._id);
        }
    }, [conversations, activeConversationId]);

    const currentChat = conversations.find(c => c._id === activeConversationId);
    const receiver = currentChat?.participants.find(p => p._id !== user?._id);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !receiver?._id || !activeConversationId) return;

        sendMessage({
            content: messageInput,
            receiverId: receiver._id
        });
        setMessageInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleStartNewChat = async (participantId: string) => {
        try {
            const conversation = await createConversation(participantId);
            setActiveConversationId(conversation._id);
            setIsNewChatModalOpen(false);
        } catch (error) {
            console.error('Failed to start conversation:', error);
        }
    };

    return (
        <div className="h-full flex bg-white overflow-hidden relative">
            {/* Conversation List */}
            <div className="w-80 lg:w-96 border-r border-gray-200/50 flex flex-col shrink-0 bg-gray-50/30">
                <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Messages</h3>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                                <span className="size-1 bg-emerald-500 rounded-full animate-pulse" />
                                Interactive Logic
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsNewChatModalOpen(true)}
                            className="group relative size-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20 flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-white text-xl group-hover:rotate-12 transition-transform">edit_square</span>
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {isLoadingConversations && (
                        <div className="flex justify-center p-6 opacity-30">
                            <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                    )}

                    {conversations.length === 0 && !isLoadingConversations && (
                        <div className="p-6 text-center opacity-30">
                            <span className="material-symbols-outlined text-4xl mb-4">move_to_inbox</span>
                            <p className="text-sm font-semibold font-medium text-gray-500">No active messages</p>
                        </div>
                    )}

                    {conversations.map((chat) => {
                        const otherParty = chat.participants.find(p => p._id !== user?._id);
                        const isActive = activeConversationId === chat._id;
                        return (
                            <div
                                key={chat._id}
                                className={`p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-white shadow-none ring-1 ring-gray-200/50' : 'hover:bg-black/5'}`}
                                onClick={() => setActiveConversationId(chat._id)}
                            >
                                <div className="flex gap-6">
                                    <div className="relative shrink-0">
                                        <div className={`size-14 rounded-xl overflow-hidden border-2 p-1 transition-all ${isActive ? 'border-primary ring-4 ring-primary/5' : 'border-gray-200/50'}`}>
                                            <img
                                                src={otherParty?.profileImage ? (otherParty.profileImage.startsWith('http') ? otherParty.profileImage : `http://localhost:5000${otherParty.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParty?.name}`}
                                                className="size-full rounded-xl object-cover"
                                                alt={otherParty?.name}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-semibold text-gray-900 uppercase italic truncate tracking-tight">{otherParty?.name || 'User'}</p>
                                            <span className="text-xs text-gray-500 font-bold truncate ml-2">
                                                {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-900 font-semibold font-medium mt-1 opacity-70 truncate">{otherParty?.role || 'Team Member'}</p>
                                        <p className="text-sm text-gray-500 mt-2 truncate italic font-medium">
                                            {chat.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {activeConversationId ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-10 py-6 border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                            {receiver && (
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-xl overflow-hidden border border-gray-200/50 p-1 bg-white">
                                        <img
                                            src={receiver.profileImage ? (receiver.profileImage.startsWith('http') ? receiver.profileImage : `http://localhost:5000${receiver.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver.name}`}
                                            className="size-full rounded-xl object-cover"
                                            alt="Receiver"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 uppercase italic leading-none tracking-tight">{receiver.name}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-[0.2em]">{receiver.role} • Online</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                            {/* Options removed as requested */}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-12 custom-scrollbar bg-gray-50/20">
                            {isLoadingMessages && (
                                <div className="flex justify-center p-20 opacity-30">
                                    <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
                                </div>
                            )}

                            {messages.length === 0 && !isLoadingMessages && (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                                    <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                                    </div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.5em] text-gray-500">No messages yet. Send a greeting!</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => {
                                const isOwnMessage = msg.senderId === user?._id;
                                return (
                                    <div key={msg._id || idx} className={`flex items-end gap-3 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse ml-auto' : ''}`}>
                                        {!isOwnMessage && (
                                            <div className="size-8 rounded-full overflow-hidden border border-slate-200 mt-1 shrink-0 shadow-sm">
                                                <img
                                                    src={receiver?.profileImage ? (receiver.profileImage.startsWith('http') ? receiver.profileImage : `http://localhost:5000${receiver.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver?.name}`}
                                                    className="size-full object-cover"
                                                    alt="S"
                                                />
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-4 text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                                isOwnMessage 
                                                    ? 'bg-indigo-600 text-white rounded-3xl rounded-br-none' 
                                                    : 'bg-white border border-slate-100 text-slate-700 rounded-3xl rounded-bl-none'
                                            }`}>
                                                {msg.content}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5 px-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isOwnMessage && (
                                                    <div className={`flex items-center ${msg.isRead ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                        <span className="material-symbols-outlined text-[12px] font-bold">
                                                            {msg.isRead ? 'done_all' : 'done'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-100">
                            <div className="relative group bg-slate-50 border border-slate-200/60 rounded-[2rem] p-2 transition-all focus-within:bg-white focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5">
                                <div className="flex items-end gap-2 pr-2">
                                    {/* Attachment and Emoji removed as requested */}
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        rows={1}
                                        className="flex-1 w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none py-4 px-4 min-h-[56px] max-h-32 custom-scrollbar"
                                        placeholder="Type a message..."
                                    />
                                    <div className="pb-2">
                                        <Button 
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim() || !activeConversationId}
                                            className="size-10 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-0 disabled:opacity-30 disabled:hover:scale-100"
                                        >
                                            <span className="material-symbols-outlined text-sm">send</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-10 bg-gray-50/20">
                        <div className="size-32 rounded-[3.5rem] bg-white border border-gray-200/50 flex items-center justify-center text-gray-500">
                            <span className="material-symbols-outlined text-6xl">chat</span>
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tighter italic">Select a Conversation</h3>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.4em]">Choose a chat from the sidebar to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            <AnimatePresence>
                {isNewChatModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNewChatModalOpen(false)}
                            className="fixed inset-0 bg-white border border-gray-200/50 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white border border-gray-200/50 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-200/50 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tighter italic">New Message</h3>
                                <Button variant="ghost" onClick={() => setIsNewChatModalOpen(false)} className="size-12 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-all border border-gray-200/50">
                                    <span className="material-symbols-outlined">close</span>
                                </Button>
                            </div>
                            <div className="p-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
                                {isLoadingParticipants ? (
                                    <div className="flex justify-center p-12 opacity-30">
                                        <div className="animate-spin size-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {participants.map((participant) => (
                                            <button
                                                key={participant._id}
                                                onClick={() => handleStartNewChat(participant._id)}
                                                className="w-full p-4 hover:bg-slate-50 rounded-2xl flex items-center gap-4 transition-all group text-left"
                                            >
                                                <div className="size-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                                    <img
                                                        src={participant.profileImage ? (participant.profileImage.startsWith('http') ? participant.profileImage : `http://localhost:5000${participant.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`}
                                                        className="size-full object-cover"
                                                        alt={participant.name}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-bold text-slate-900 uppercase italic tracking-tight">{participant.name}</h4>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{participant.department || 'General'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-xs text-slate-500 font-medium truncate">{participant.email}</p>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">{participant.role}</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1">arrow_forward_ios</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
