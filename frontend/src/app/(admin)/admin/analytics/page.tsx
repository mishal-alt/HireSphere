'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import {
    Download,
    TrendingUp,
    Clock,
    UserCheck,
    Users,
    ChevronDown,
    Activity,
    Star,
    Lightbulb,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                setAnalytics(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-4 border-emerald-800 border-t-transparent rounded-full" />
            </div>
        );
    }

    const { 
        coreMetrics = [], 
        velocity = [], 
        deptEfficiency = [], 
        sources = [], 
        topInterviewers = [],
        totalCandidates = 0
    } = analytics || {};

    const iconMap: Record<string, any> = {
        Users,
        Clock,
        UserCheck,
        TrendingUp
    };

    return (
        <div className="space-y-12 pb-10 font-sans">
            {/* Analytics Header */}
            <div className="relative group">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-gray-100 text-gray-900 text-xs font-medium"
                        >
                            <Activity className="size-3.5" />
                            Live Reports
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                            Recruitment <br /> <span className="text-gray-400">Performance.</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-lg text-sm">
                            Evaluate your hiring pipeline with real-time data and comprehensive insights.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 items-end">
                        <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <Download className="size-4" />
                            Export Data
                        </Button>
                    </div>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreMetrics.map((stat: any, i: number) => {
                    const Icon = iconMap[stat.icon] || Activity;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-200/50 rounded-xl p-6 group hover:bg-gray-50 transition-colors cursor-default"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="size-12 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-800 group-hover:text-white transition-all">
                                    <Icon className="size-6" />
                                </div>
                                <span className={`text-xs font-bold ${stat.growth.startsWith('+') ? 'text-emerald-800 bg-emerald-50 border-emerald-100' : 'text-slate-500 bg-slate-50 border-slate-200'} px-2.5 py-1 rounded-full border shadow-sm`}>
                                    {stat.growth}
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.val}</h3>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hiring Velocity */}
                <div className="lg:col-span-8 flex flex-col relative py-8 border-b border-gray-200/50">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Hiring Velocity</h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">Average days to fill a position by month.</p>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 relative z-10 px-4">
                        {velocity.map((v: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar relative h-full justify-end">
                                <div className="w-full relative h-[80%] flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${Math.min(v.value, 100)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 1, ease: 'easeOut' }}
                                        className={`w-full rounded-md relative transition-all duration-300 ${v.value > 0 ? 'bg-emerald-800' : 'bg-gray-200'} group-hover/bar:opacity-80`}
                                    />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-[10px] font-bold text-gray-900">
                                        {v.value}d
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {v.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Efficiency by Department */}
                <div className="lg:col-span-4 flex flex-col relative py-8 border-b border-gray-200/50">
                    <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-8">Department Efficiency</h3>
                    <div className="space-y-8 relative z-10">
                        {deptEfficiency.map((dept: any, i: number) => (
                            <div key={i} className="space-y-2 group/item">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-sm font-medium text-gray-500">{dept.label}</span>
                                    <span className="text-sm font-semibold text-gray-900">{dept.percent}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${dept.percent}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                                        className="h-full bg-emerald-800 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                        {deptEfficiency.length === 0 && (
                            <div className="text-center py-12">
                                <Activity className="size-8 text-gray-200 mx-auto mb-3" />
                                <p className="text-xs text-gray-400 italic">No hiring data available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hiring Sources & Interviewer Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Acquisition Channels */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-10 py-8">
                    <div className="relative size-44 shrink-0">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle className="text-gray-200" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                whileInView={{ strokeDasharray: "55 100" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5 }}
                                className="text-emerald-800" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDashoffset="0" strokeLinecap="round" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                whileInView={{ strokeDasharray: "20 100" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                                className="text-gray-400" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDashoffset="-55" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">{totalCandidates}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Talent Pool</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <h4 className="text-xs font-bold text-gray-900 mb-4 px-1 uppercase tracking-[0.2em]">Source Channels</h4>
                        {sources.map((source: any, i: number) => (
                            <div key={i} className="flex items-center justify-between group/row border-b border-gray-50 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`size-3 rounded-md ${i === 0 ? 'bg-emerald-800' : 'bg-gray-300'} transition-transform group-hover/row:scale-110`} />
                                    <span className="text-sm font-medium text-gray-500 group-hover/row:text-gray-900 transition-colors">{source.label}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-900">{source.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interviewer Performance */}
                <div className="lg:col-span-7 flex flex-col py-8">
                    <div className="pb-6 border-b border-gray-200/50">
                        <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Top Interviewers</h4>
                        <p className="text-sm font-medium text-gray-500 mt-1">Review activity levels and effectiveness.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table >
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interviewer</TableHead>
                                    <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Sessions</TableHead>
                                    <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</TableHead>
                                    <TableHead className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topInterviewers.map((rec: any, i: number) => (
                                    <TableRow key={i} className="hover:bg-gray-50 transition-colors group/row border-none">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg overflow-hidden bg-gray-50 transition-transform group-hover/row:scale-105">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.seed}`} className="size-full object-cover" alt={rec.name} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{rec.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-emerald-900">{rec.hits}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-sm text-gray-500 font-medium">{rec.eff}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {[...Array(5)].map((_, stars) => (
                                                    <Star key={stars} className={`size-3 ${stars < rec.rating ? 'text-emerald-800 fill-emerald-800' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {topInterviewers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-gray-400 italic text-xs">
                                            No interviewer activity logged yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Strategic Insight */}
            <div className="bg-emerald-800/[0.03] border border-emerald-800/10 p-8 rounded-3xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="size-16 rounded-2xl bg-emerald-900 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110">
                        <Lightbulb className="size-7 text-emerald-400" />
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex items-center gap-6 justify-center md:justify-start">
                            <h5 className="text-lg font-bold text-gray-900 tracking-tight uppercase italic underline decoration-emerald-800/20 underline-offset-8">Strategic Insight</h5>
                            <span className="px-3 py-1 rounded-full bg-emerald-800 text-white text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">AI Pulse</span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm max-w-4xl leading-relaxed">
                            {velocity && velocity.length > 0 && velocity[velocity.length - 1]?.value > 0 
                                ? `Your current hiring velocity is ${velocity[velocity.length - 1]?.value} days. To optimize, focus on reducing time-to-evaluation in the Engineering department which currently leads the pipeline.`
                                : "Add more hiring data to unlock automated strategic insights and velocity optimization tips."
                            }
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
