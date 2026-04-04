'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Portal from '@/components/Portal';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
}

export default function MessageModal({ isOpen, onClose, candidateId, candidateName, candidateEmail }: MessageModalProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        
        try {
            await api.post(`/candidates/${candidateId}/message`, { message });
            setIsSending(false);
            setIsSent(true);
            toast.success(`Email dispatched to ${candidateName}`);
            
            // Auto close after success
            setTimeout(() => {
                onClose();
                setMessage('');
                setIsSent(false);
            }, 2000);
        } catch (error: any) {
            console.error('Failed to send email:', error);
            toast.error(error.response?.data?.message || 'Failed to dispatch email');
            setIsSending(false);
        }
    };

    return (
        <Portal>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20">
                                        <MessageSquare className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Send Message</h2>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">To: {candidateName}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSend} className="p-6 space-y-6">
                                {isSent ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-10 flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <CheckCircle2 className="size-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Message Delivered!</h3>
                                            <p className="text-sm text-slate-500 font-medium">{candidateName} has been notified.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-wider">Candidate Email</label>
                                            <Input 
                                                disabled
                                                value={candidateEmail}
                                                className="bg-slate-50/50 border-slate-100 text-slate-500 font-medium rounded-xl h-11"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-wider">Your Message</label>
                                            <textarea
                                                required
                                                autoFocus
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder={`Type your message to ${candidateName}...`}
                                                className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all resize-none placeholder:text-slate-400"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button 
                                                variant="outline"
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 font-bold"
                                            >
                                                Discard
                                            </Button>
                                            <Button 
                                                disabled={isSending || !message.trim()}
                                                type="submit"
                                                className="flex-[2] h-11 rounded-xl bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isSending ? (
                                                    <Loader2 className="size-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="size-4" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
}
