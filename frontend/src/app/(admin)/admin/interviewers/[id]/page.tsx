'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import { 
    ArrowLeft, 
    Mail, 
    ShieldCheck, 
    Building2, 
    Star, 
    Trophy, 
    Zap, 
    Clock, 
    CheckCircle2, 
    History,
    ArrowUpRight,
    User,
    ChevronRight,
    Activity
} from 'lucide-react';

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
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full flex items-center justify-center text-primary font-bold">
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
                    className="px-6 h-10 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-10">
            {/* Header / Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm group active:scale-95"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                    </button>
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interviewer Profile</h1>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md">ALIAS: {selectedInterviewer.name.split(' ')[0]}</span>
                            <span className="size-1 bg-slate-300 rounded-full" />
                            <span>System Operator</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        <Trophy className="size-3.5" />
                        Top Performer
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Panel: Profile Card */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <ShieldCheck className="size-48 text-slate-900" />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="size-32 rounded-[2.5rem] border-4 border-slate-50 p-1 bg-white shadow-xl overflow-hidden mx-auto group-hover:border-primary transition-all">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInterviewer.name}`} 
                                    alt={selectedInterviewer.name} 
                                    className="size-full rounded-2xl object-cover bg-slate-50" 
                                />
                            </div>
                            
                            <div className="space-y-2 text-center">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedInterviewer.name}</h2>
                                <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-primary">
                                    <div className={`size-2 rounded-full ${selectedInterviewer.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                                    {selectedInterviewer.isActive ? 'Active Operator' : 'Dormant'}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Interviews</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tighter">124</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Rating</p>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <p className="text-2xl font-bold text-slate-900 tracking-tighter">4.9</p>
                                        <Star className="size-4 text-amber-400 fill-amber-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Personnel Data */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="size-1 bg-primary rounded-full" />
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel Data</h3>
                        </div>
                        <div className="space-y-6">
                            <InfoItem icon={Mail} label="Corporate Email" value={selectedInterviewer.email} />
                            <InfoItem icon={Building2} label="Department" value={selectedInterviewer.department || 'Engineering Logic'} />
                            <InfoItem icon={ShieldCheck} label="Access Tier" value="Standard Interviewer" />
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Performance Metrics */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm h-full space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-1 bg-primary rounded-full" />
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance Metrics</h3>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                                <Activity className="size-3.5" />
                                Live Analytics
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <MetricCard label="Efficiency" value="98%" trend="+2.4%" />
                                <MetricCard label="Hire Rate" value="34%" trend="-1.2%" />
                                <MetricCard label="Punctuality" value="100%" trend="Stable" />
                            </div>

                            <div className="pt-10 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-6">Specialization Modules</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['Frontend Logic Systems', 'Distributed Backend Architecture', 'Agile Methodology Execution', 'Interpersonal Calibration'].map(spec => (
                                        <div key={spec} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-primary/30 transition-all shadow-sm">
                                            <div className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="size-4" />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Audit Logs</p>
                                    <button className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                                        View Full History
                                        <ArrowUpRight className="size-3" />
                                    </button>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                    <LogEntry time="2 hours ago" action="Completed technical interview with Sarah Smith" icon={Clock} />
                                    <LogEntry time="Yesterday" action="Submitted evaluation report for candidate #8821" icon={History} />
                                    <LogEntry time="3 days ago" action="Initialized assessment for Junior Dev role" icon={Zap} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-5 group transition-transform hover:translate-x-1">
            <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                <Icon className="size-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className="text-sm font-bold text-slate-900 tracking-tight truncate leading-none">{value}</p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
    return (
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center group hover:bg-white hover:border-primary/20 transition-all shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
            <p className="text-4xl font-bold text-slate-900 tracking-tighter mb-3">{value}</p>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 
                trend === 'Stable' ? 'bg-blue-50 text-blue-600' : 
                'bg-red-50 text-red-600'
            }`}>
                {trend}
            </div>
        </div>
    );
}

function LogEntry({ time, action, icon: Icon }: { time: string; action: string; icon: any }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0 group/item">
            <div className="flex items-center gap-4">
                <div className="size-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover/item:text-primary transition-colors">
                    <Icon className="size-4" />
                </div>
                <p className="text-[11px] text-slate-600 font-bold tracking-tight">{action}</p>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{time}</p>
        </div>
    );
}
