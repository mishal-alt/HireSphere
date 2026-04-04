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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full flex items-center justify-center text-gray-900 font-bold">
                    HS
                </div>
            </div>
        );
    }

    if (!selectedInterviewer) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500 font-bold font-medium text-xs">Interviewer not found</p>
                <Button variant="ghost" 
                    onClick={() => router.back()}
                    className="px-6 h-10 bg-white border border-gray-200/50 rounded-xl text-sm font-bold font-medium text-gray-500 hover:bg-gray-50 transition-all"
                >
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-10">
            {/* Header / Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" 
                        onClick={() => router.back()}
                        className="size-12 rounded-xl bg-white border border-gray-200/50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-primary transition-all group active:scale-95"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                    <div className="space-y-1.5">
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Interviewer Profile</h1>
                        <div className="flex items-center gap-2 text-sm uppercase font-bold tracking-[0.2em] text-gray-500">
                            <span className="px-2 py-0.5 bg-gray-100 rounded-md">ALIAS: {selectedInterviewer.name.split(' ')[0]}</span>
                            <span className="size-1 bg-gray-100 rounded-full" />
                            <span>System Operator</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-900 font-medium">
                        <Trophy className="size-3.5" />
                        Top Performer
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Panel: Profile Card */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200/50 rounded-2xl p-6 text-center relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <ShieldCheck className="size-48 text-gray-900" />
                        </div>
                        
                        <div className="relative z-10 space-y-10">
                            <div className="size-32 rounded-2xl border-4 border-gray-200/50 p-1 bg-white shadow-none overflow-hidden mx-auto group-hover:border-primary transition-all">
                                <img 
                                    src={selectedInterviewer.profileImage ? (selectedInterviewer.profileImage.startsWith('http') ? selectedInterviewer.profileImage : `http://localhost:5000${selectedInterviewer.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInterviewer.name}`} 
                                    alt={selectedInterviewer.name} 
                                    className="size-full rounded-xl object-cover bg-gray-50 border border-gray-100" 
                                />
                            </div>
                            
                            <div className="space-y-2 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedInterviewer.name}</h2>
                                <div className="flex items-center justify-center gap-2 text-sm uppercase font-bold tracking-[0.2em] text-gray-900">
                                    <div className={`size-2 rounded-full ${selectedInterviewer.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-100'}`} />
                                    {selectedInterviewer.isActive ? 'Active Operator' : 'Dormant'}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200/50">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-500 font-medium leading-none">Interviews</p>
                                    <p className="text-2xl font-bold text-gray-900 tracking-tighter">124</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-500 font-medium leading-none">Rating</p>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <p className="text-2xl font-bold text-gray-900 tracking-tighter">4.9</p>
                                        <Star className="size-4 text-emerald-700 fill-emerald-700" />
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
                        className="bg-white border border-gray-200/50 rounded-2xl p-6 space-y-10"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="size-1 bg-primary rounded-full" />
                            <h3 className="text-sm font-bold text-gray-500 font-medium">Personnel Data</h3>
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
                        className="bg-white border border-gray-200/50 rounded-2xl p-6 h-full space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-1 bg-primary rounded-full" />
                                <h3 className="text-sm font-bold text-gray-500 font-medium">Performance Metrics</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 font-medium">
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

                            <div className="pt-10 border-t border-gray-200/50">
                                <p className="text-sm font-bold text-gray-500 font-medium ml-1 mb-6">Specialization Modules</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['Frontend Logic Systems', 'Distributed Backend Architecture', 'Agile Methodology Execution', 'Interpersonal Calibration'].map(spec => (
                                        <div key={spec} className="flex items-center gap-6 p-5 bg-gray-50 border border-gray-200/50 rounded-xl group hover:bg-white hover:bg-gray-50 transition-all">
                                            <div className="size-8 rounded-lg bg-white border border-gray-200/50 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="size-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 font-medium">{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-200/50">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm font-bold text-gray-500 font-medium ml-1">System Audit Logs</p>
                                    <Button variant="ghost" className="text-xs font-bold text-gray-900 font-medium flex items-center gap-1.5 hover:underline">
                                        View Full History
                                        <ArrowUpRight className="size-3" />
                                    </Button>
                                </div>
                                <div className="bg-gray-50 border border-gray-200/50 rounded-xl p-6 space-y-4">
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
            <div className="size-12 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-800 group-hover:text-white group-hover:border-primary transition-all">
                <Icon className="size-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500 font-medium leading-none mb-1.5">{label}</p>
                <p className="text-sm font-bold text-gray-900 tracking-tight truncate leading-none">{value}</p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
    return (
        <div className="p-6 bg-gray-50 border border-gray-200/50 rounded-2xl text-center group hover:bg-white hover:bg-gray-50 transition-all">
            <p className="text-sm font-bold text-gray-500 font-medium mb-3">{label}</p>
            <p className="text-xl font-semibold text-gray-900 tracking-tighter mb-3">{value}</p>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase ${ trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' : trend === 'Stable' ? 'bg-gray-50 text-gray-900' : 'bg-gray-50 text-gray-700' }`}>
                {trend}
            </div>
        </div>
    );
}

function LogEntry({ time, action, icon: Icon }: { time: string; action: string; icon: any }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-200/50 last:border-0 group/item">
            <div className="flex items-center gap-6">
                <div className="size-8 rounded-lg bg-white border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover/item:text-gray-900 transition-colors">
                    <Icon className="size-4" />
                </div>
                <p className="text-sm text-gray-500 font-bold tracking-tight">{action}</p>
            </div>
            <p className="text-xs text-gray-500 font-bold font-medium">{time}</p>
        </div>
    );
}
