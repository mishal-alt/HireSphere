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


export default function MessagesPage() {
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
            <div className="w-80 lg:w-96 border-r border-gray-100 flex flex-col shrink-0 bg-gray-50/30">
                <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tighter italic font-heading">Messages</h3>
                        <Button variant="ghost"
                            onClick={() => setIsNewChatModalOpen(true)}
                            className="size-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center hover:bg-primary transition-all shadow-none shadow-slate-900/10"
                        >
                            <span className="material-symbols-outlined text-xl">edit_square</span>
                        </Button>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">All Chats</Button>
                        <Button variant="ghost" className="px-6 py-2 text-[10px] font-semibold uppercase tracking-widest rounded-xl bg-white text-gray-400 hover:text-gray-900 transition-colors">Archive</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {isLoadingConversations && (
                        <div className="flex justify-center p-6 opacity-30">
                            <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                    )}

                    {conversations.map((chat) => {
                        const otherParty = chat.participants.find(p => p._id !== user?._id);
                        const isActive = activeConversationId === chat._id;
                        return (
                            <div
                                key={chat._id}
                                className={`p-5 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-white  shadow-none shadow-slate-200/40' : 'hover:bg-white/50'}`}
                                onClick={() => setActiveConversationId(chat._id)}
                            >
                                <div className="flex gap-6">
                                    <div className="relative shrink-0">
                                        <div className={`size-14 rounded-2xl overflow-hidden border-2 p-1 transition-all ${isActive ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}>
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
                                            <span className="text-[9px] text-gray-500 font-medium truncate ml-2">
                                                {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className="text-[9px] text-gray-900 font-semibold uppercase tracking-widest mt-1 opacity-70 truncate">{otherParty?.role || 'Team Member'}</p>
                                        <p className="text-[11px] text-gray-500 mt-2 truncate italic font-medium">
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
                                    <div className="size-12 rounded-2xl overflow-hidden p-1 bg-white">
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
                                            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-[0.2em]">{receiver.role} • Online</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">call</span>
                                </Button>
                                <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">videocam</span>
                                </Button>
                                <div className="w-px h-6 bg-slate-100 mx-2"></div>
                                <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-xl">info</span>
                                </Button>
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
                                    <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                                    </div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gray-500">No messages yet. Send a greeting!</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => {
                                const isOwnMessage = msg.senderId === user?._id;
                                return (
                                    <div key={msg._id || idx} className={`flex items-start gap-6 max-w-2xl ${isOwnMessage ? 'flex-row-reverse ml-auto' : ''}`}>
                                        {!isOwnMessage && (
                                            <div className="size-8 rounded-xl overflow-hidden mt-1 shrink-0">
                                                <img
                                                    src={receiver?.profileImage ? (receiver.profileImage.startsWith('http') ? receiver.profileImage : `http://localhost:5000${receiver.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver?.name}`}
                                                    className="size-full object-cover"
                                                    alt="S"
                                                />
                                            </div>
                                        )}
                                        <div className={`space-y-2 ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className={`${isOwnMessage
                                                    ? 'bg-emerald-800 text-white p-5 rounded-3xl rounded-tr-none shadow-none shadow-slate-900/10'
                                                    : 'bg-white border border-gray-100 p-5 rounded-3xl rounded-tl-none shadow-none shadow-slate-200/30'
                                                }`}>
                                                <p className={`text-sm leading-relaxed ${isOwnMessage ? 'font-medium italic' : 'font-medium text-gray-600'}`}>
                                                    {msg.content}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 px-1">
                                                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-[0.2em]">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isOwnMessage && (
                                                    <span className={`material-symbols-outlined text-[14px] ${msg.isRead ? 'text-gray-900' : 'text-slate-300'}`}>
                                                        {msg.isRead ? 'done_all' : 'done'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-gray-100 bg-white">
                            <div className="bg-gray-50 rounded-2xl p-4 focus-within:border-primary/30 focus-within:bg-white transition-all shadow-none">
                                <textarea
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 resize-none min-h-[50px] px-4 py-2"
                                    placeholder="Type your message..."
                                />
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/50 px-2 font-heading">
                                    <div className="flex gap-1">
                                        <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-xl">attach_file</span>
                                        </Button>
                                        <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-xl">mood</span>
                                        </Button>
                                    </div>
                                    <Button variant="default"
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim() || !activeConversationId}
                                        className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        Send Message
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 bg-gray-50/20">
                        <div className="size-32 rounded-2xl bg-white border border-gray-100 shadow-none flex items-center justify-center text-slate-200">
                            <span className="material-symbols-outlined text-6xl">chat</span>
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tighter italic font-heading">Select a Conversation</h3>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.4em]">Choose a chat from the sidebar to start messaging</p>
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
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-none"
                        >
                            <div className="p-6 border-b border-gray-200/50 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tighter italic font-heading">New Message</h3>
                                <Button variant="ghost" onClick={() => setIsNewChatModalOpen(false)} className="size-12 rounded-2xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-all border border-gray-100">
                                    <span className="material-symbols-outlined">close</span>
                                </Button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                                {isLoadingParticipants ? (
                                    <div className="flex justify-center p-20 opacity-30">
                                        <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
                                    </div>
                                ) : (
                                    participants.map((participant) => (
                                        <Button variant="ghost"
                                            key={participant._id}
                                            onClick={() => handleStartNewChat(participant._id)}
                                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-6 hover:bg-white hover:border-primary/30 hover:shadow-none hover:shadow-slate-200/50 transition-all group text-left"
                                        >
                                            <div className="size-20 rounded-2xl overflow-hidden border border-white shadow-none group-hover:ring-8 group-hover:ring-primary/5 transition-all bg-slate-100">
                                                <img
                                                    src={participant.profileImage ? (participant.profileImage.startsWith('http') ? participant.profileImage : `http://localhost:5000${participant.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`}
                                                    className="size-full object-cover"
                                                    alt={participant.name}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xl font-semibold text-gray-900 uppercase italic tracking-tighter group-hover:text-gray-900 transition-colors">{participant.name}</h4>
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1 italic">{participant.role} • {participant.department || 'General'}</p>
                                                <span className="inline-block mt-4 px-4 py-1.5 bg-white rounded-xl text-[9px] font-semibold text-gray-500 uppercase tracking-widest">{participant.email}</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-200 group-hover:text-gray-900 transition-all group-hover:translate-x-2 text-4xl">arrow_forward</span>
                                        </Button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
