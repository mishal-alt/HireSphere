'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    TrendingUp,
    Clock,
    UserCheck,
    Users,
    ChevronDown,
    Activity,
    PieChart,
    BarChart3,
    Star,
    Lightbulb,
    Target,
    Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function AnalyticsPage() {
    return (
        <div className="space-y-12 pb-10">
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
                {[
                    { label: 'Total Hires', val: '128', growth: '+12%', icon: Users, color: 'text-emerald-800' },
                    { label: 'Avg. Time to Hire', val: '24d', growth: '-3%', icon: Clock, color: 'text-emerald-700' },
                    { label: 'Offer Acceptance', val: '82%', growth: '-2%', icon: UserCheck, color: 'text-emerald-800' },
                    { label: 'Active Pipeline', val: '45', growth: '+15%', icon: TrendingUp, color: 'text-emerald-800' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-gray-200/50 rounded-xl p-6  group hover:bg-gray-100 transition-colors cursor-default hover:"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="size-12 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-800 group-hover:text-white group-hover:border-primary transition-all">
                                <stat.icon className="size-6" />
                            </div>
                            <span className={`text-xs font-bold ${stat.growth.startsWith('+') ? 'text-emerald-800 bg-emerald-50 border-emerald-100' : 'text-slate-500 bg-slate-50 border-slate-200'} px-2.5 py-1 rounded-full border shadow-sm`}>
                                {stat.growth}
                            </span>
                        </div>
                        <p className="text-sm font-bold font-medium text-gray-500 mb-1.5">{stat.label}</p>
                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{stat.val}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hiring Velocity */}
                <div className="lg:col-span-8 flex flex-col relative py-8 border-b border-gray-200/50">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Hiring Velocity</h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">Average days to fill a position by month.</p>
                        </div>
                        <div className="relative group">
                            <select className="bg-transparent border border-gray-200/50 rounded-md px-4 py-2 text-sm font-medium text-gray-500 outline-none appearance-none cursor-pointer pr-10">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none size-4" />
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 relative z-10 px-4">
                        {[60, 75, 55, 85, 65, 60].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar relative h-full justify-end">
                                <div className="w-full relative h-full flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${val}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 1, ease: 'easeOut' }}
                                        className={`w-full rounded-md relative transition-all duration-300 ${i === 3 ? 'bg-emerald-800 shadow-[0_0_15px_rgba(6,78,59,0.2)]' : 'bg-gray-200 group-hover/bar:bg-gray-300'}`}
                                    />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-sm font-medium text-gray-900">
                                        {val}d
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-500">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Efficiency by Department */}
                <div className="lg:col-span-4 flex flex-col relative py-8 border-b border-gray-200/50">
                    <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-8">Department Efficiency</h3>
                    <div className="space-y-8 relative z-10">
                        {[
                            { label: 'Engineering', val: 65 },
                            { label: 'Product', val: 42 },
                            { label: 'Sales', val: 78 },
                            { label: 'Marketing', val: 55 },
                            { label: 'Operations', val: 38 },
                        ].map((dept, i) => (
                            <div key={i} className="space-y-2 group/item">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-sm font-medium text-gray-500">{dept.label}</span>
                                    <span className="text-sm font-semibold text-gray-900">{dept.val}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${dept.val}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                                        className="h-full bg-emerald-800 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hiring Sources & Interviewer Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Acquisition Channels */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 py-8">
                    <div className="relative size-44 shrink-0">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle className="text-gray-200" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                whileInView={{ strokeDasharray: "45 100" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5 }}
                                className="text-emerald-800" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDashoffset="0" strokeLinecap="round" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                whileInView={{ strokeDasharray: "25 100" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                                className="text-gray-400" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDashoffset="-45" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-semibold text-gray-900 tracking-tight">1.2k</span>
                            <span className="text-xs text-gray-500 font-medium mt-0.5">Apps</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 px-1">Source Channels</h4>
                        {[
                            { label: 'LinkedIn', val: '45%', color: 'bg-emerald-800' },
                            { label: 'Referrals', val: '25%', color: 'bg-gray-400' },
                            { label: 'Job Boards', val: '15%', color: 'bg-gray-200' },
                            { label: 'Direct', val: '15%', color: 'bg-gray-100 border border-gray-200/50' },
                        ].map((source, i) => (
                            <div key={i} className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-3">
                                    <div className={`size-3 rounded-md ${source.color} transition-transform group-hover/row:scale-110`} />
                                    <span className="text-sm font-medium text-gray-500 group-hover/row:text-gray-900 transition-colors">{source.label}</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-900">{source.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interviewer Performance */}
                <div className="lg:col-span-7 flex flex-col py-8">
                    <div className="pb-6 border-b border-gray-200/50 flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 tracking-tight">Top Interviewers</h4>
                            <p className="text-sm font-medium text-gray-500 mt-1">Activity over current period</p>
                        </div>
                        <Button variant="ghost" className="h-8 px-4 rounded-md border border-gray-200/50 text-gray-500 text-sm font-medium hover:border-gray-300 hover:text-gray-900 transition-all">Detailed List</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <Table >
                            <TableHeader>
                                <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                    <TableHead className="px-10 py-4 text-xs font-medium text-gray-400 border-b border-gray-200/50">Interviewer</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-medium text-gray-400 border-b border-gray-200/50 text-center">Sessions</TableHead>
                                    <TableHead className="px-8 py-4 text-xs font-medium text-gray-400 border-b border-gray-200/50">Efficiency</TableHead>
                                    <TableHead className="px-10 py-4 text-xs font-medium text-gray-400 border-b border-gray-200/50 text-right">Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-200/60">
                                {[
                                    { name: 'Sarah Jenkins', hits: 32, eff: '98%', rating: 5, seed: 'jenkins' },
                                    { name: 'David Moore', hits: 28, eff: '92%', rating: 4, seed: 'moore' },
                                    { name: 'Elena Rossi', hits: 24, eff: '85%', rating: 4, seed: 'rossi' },
                                ].map((rec, i) => (
                                    <TableRow key={i} className="hover:bg-gray-50 transition-colors group/row">
                                        <TableCell className="px-10 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-md overflow-hidden bg-gray-50 transition-transform group-hover/row:scale-105">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.seed}`} className="size-full object-cover" alt={rec.name} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{rec.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-4 text-center">
                                            <span className="text-sm font-semibold text-gray-900">{rec.hits}</span>
                                        </TableCell>
                                        <TableCell className="px-8 py-4">
                                            <span className="text-sm text-gray-500">{rec.eff}</span>
                                        </TableCell>
                                        <TableCell className="px-10 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {[...Array(5)].map((_, stars) => (
                                                    <Star key={stars} className={`size-3 ${stars < rec.rating ? 'text-emerald-800 fill-emerald-800' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Strategic Insight */}
            <div className="bg-emerald-800/[0.03] border border-emerald-800/10 p-6 rounded-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="size-14 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                        <Lightbulb className="size-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex items-center gap-6 justify-center md:justify-start">
                            <h5 className="text-lg font-bold text-gray-900 tracking-tight uppercase italic">Strategic Insight: Velocity Factor</h5>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-800 text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">Active Tip</span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm max-w-4xl">
                            Engineering hiring speed has improved by <span className="text-emerald-800 font-bold">15%</span> after implemented stage-based filtering. Focus on Product roles next to achieve consistent cross-department velocity.
                        </p>
                    </div>
                    <Button variant="default" className="h-10 px-8 bg-emerald-800 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shrink-0 shadow-sm border-none">
                        Detailed Analysis
                    </Button>
                </div>
            </div>
        </div>
    );
}
