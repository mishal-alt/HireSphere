'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdateInterviewer } from '@/hooks/useInterviewers';
import Portal from '@/components/Portal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface EditInterviewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    interviewer: any;
}

export default function EditInterviewerModal({ isOpen, onClose, interviewer }: EditInterviewerModalProps) {
    const updateMutation = useUpdateInterviewer();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        isActive: true
    });

    useEffect(() => {
        if (interviewer) {
            setFormData({
                name: interviewer.name || '',
                email: interviewer.email || '',
                department: interviewer.department || '',
                isActive: interviewer.isActive ?? true
            });
        }
    }, [interviewer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({ id: interviewer._id, data: formData });
            onClose();
        } catch (error) {
            // Error handled by hook
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-3xl"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">edit_square</span>
                            </div>

                            <div className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="size-12 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center text-gray-900 hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl">settings_account_box</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-tight leading-none">Modify Logic</h2>
                                            <p className="text-xs font-bold text-gray-500 font-medium mt-1">Adjusting agent parameters</p>
                                        </div>
                                    </div>
                                    <Button variant="secondary"
                                        onClick={onClose}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Agent Identification</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-900 transition-colors text-lg">badge</span>
                                            <Input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Full Legal ID"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Communication Channel</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-900 transition-colors text-lg">alternate_email</span>
                                            <Input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="corp-nexus@hq.sh"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Operative Unit</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-900 transition-colors text-lg">lan</span>
                                            <Input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="e.g. CORE-ENG"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-xl border border-gray-200/50 shadow-inner">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900 font-medium leading-tight">Deployment Status</p>
                                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">Toggle network availability</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                                            <Input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            />
                                            <div className="w-11 h-6 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                                        </label>
                                    </div>

                                    <div className="pt-6">
                                        <Button variant="outline"
                                            disabled={updateMutation.isPending}
                                            type="submit"
                                            className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            {updateMutation.isPending ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">sync_saved_locally</span>
                                                    <span>Push Configuration</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
}
