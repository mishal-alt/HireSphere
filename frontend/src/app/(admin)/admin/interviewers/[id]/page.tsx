'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';

export default function InterviewerProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { selectedInterviewer, loading, fetchInterviewerById } = useAdminInterviewerStore();

    useEffect(() => {
        if (id) {
            fetchInterviewerById(id as string);
        }
    }, [id, fetchInterviewerById]);

    if (loading && !selectedInterviewer) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center text-primary">
                    HS
                </div>
            </div>
        );
    }

    if (!selectedInterviewer) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Interviewer not found</p>
                <button 
                    onClick={() => router.back()}
                    className="px-6 h-10 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="size-10 rounded-xl bg-[#080808] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all group"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Interviewer Profile</h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">System Alias: {selectedInterviewer.name.split(' ')[0]} / ID: {selectedInterviewer._id.substring(0, 8)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="size-24 rounded-2xl overflow-hidden border-2 border-white/10 mx-auto mb-6 shadow-2xl shadow-primary/20 bg-[#121212]">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInterviewer.name}`} 
                                    alt={selectedInterviewer.name} 
                                    className="size-full object-cover" 
                                />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white tracking-tight italic">{selectedInterviewer.name}</h2>
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-primary mt-2">Status: {selectedInterviewer.isActive ? 'Active Operator' : 'Dormant'}</p>
                            
                            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Interviews</p>
                                    <p className="text-xl font-black text-white italic">124</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Rating</p>
                                    <p className="text-xl font-black text-white italic">4.9</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl"
                    >
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Personnel Data</h3>
                        <div className="space-y-6">
                            <InfoItem icon="mail" label="Corporate Email" value={selectedInterviewer.email} />
                            <InfoItem icon="hub" label="Department" value={selectedInterviewer.department || 'Engineering Logic'} />
                            <InfoItem icon="verified_user" label="Access Tier" value="Standard Interviewer" />
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Performance / Stats */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl h-full"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Performance Metrics</h3>
                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Top Performer</span>
                        </div>

                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <MetricCard label="Efficiency" value="98%" trend="+2.4%" />
                                <MetricCard label="Hire Rate" value="34%" trend="-1.2%" />
                                <MetricCard label="Punctuality" value="100%" trend="Stable" />
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Specialization Modules</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['Frontend Logic Systems', 'Distributed Backend Architecture', 'Agile Methodology Execution', 'Interpersonal Calibration'].map(spec => (
                                        <div key={spec} className="flex items-center gap-3 p-4 bg-[#121212] border border-white/5 rounded-2xl">
                                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">System Logs</p>
                                <div className="space-y-3">
                                    <LogEntry time="2 hours ago" action="Completed technical interview with Sarah Smith" />
                                    <LogEntry time="Yesterday" action="Submitted evaluation report for candidate #8821" />
                                    <LogEntry time="3 days ago" action="Initialized assessment for Junior Dev role" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-[#121212] flex items-center justify-center text-primary shrink-0 border border-white/5 shadow-inner">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{label}</p>
                <p className="text-[11px] font-bold text-white tracking-tight truncate mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
    return (
        <div className="p-6 bg-[#121212] border border-white/5 rounded-2xl text-center group hover:border-primary/20 transition-all">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
            <p className={`text-[9px] font-bold uppercase mt-2 ${trend.startsWith('+') ? 'text-emerald-500' : trend === 'Stable' ? 'text-blue-500' : 'text-red-500'}`}>{trend}</p>
        </div>
    );
}

function LogEntry({ time, action }: { time: string; action: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <p className="text-[11px] text-slate-400 font-medium">{action}</p>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{time}</p>
        </div>
    );
}
