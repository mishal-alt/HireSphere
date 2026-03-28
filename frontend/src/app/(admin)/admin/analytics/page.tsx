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

export default function AnalyticsPage() {
    return (
        <div className="space-y-12 pb-10">
            {/* Analytics Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16 border border-slate-200 bg-white group shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(67,56,202,0.03),transparent_70%)] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10"
                        >
                            <Activity className="size-3.5" />
                            Live Reports
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
                            Recruitment <br /> <span className="text-primary">Performance.</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg text-lg">
                            Evaluate your hiring pipeline with real-time data and comprehensive insights.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 items-end">
                        <button className="h-14 px-10 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm flex items-center gap-3">
                            <Download className="size-5" />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Hires', val: '128', growth: '+12%', icon: Users, color: 'text-primary' },
                    { label: 'Avg. Time to Hire', val: '24d', growth: '-3%', icon: Clock, color: 'text-orange-500' },
                    { label: 'Offer Acceptance', val: '82%', growth: '-2%', icon: UserCheck, color: 'text-emerald-500' },
                    { label: 'Active Pipeline', val: '45', growth: '+5%', icon: TrendingUp, color: 'text-blue-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-3xl border border-slate-200 group hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                                <stat.icon className="size-6" />
                            </div>
                            <span className={`text-[10px] font-bold ${stat.growth.startsWith('+') ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-orange-500 bg-orange-50 border-orange-100'} px-2.5 py-1 rounded-full border uppercase tracking-widest`}>
                                {stat.growth}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.val}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Hiring Velocity */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Hiring Velocity</h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">Average days to fill a position by month.</p>
                        </div>
                        <div className="relative group">
                            <select className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 outline-none hover:border-primary transition-all appearance-none cursor-pointer pr-10">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4 group-hover:text-primary transition-colors" />
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 relative z-10 px-4">
                        {[60, 75, 55, 85, 65, 60].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar relative h-full justify-end">
                                <div className="w-full relative h-full flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${val}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 1, ease: 'easeOut' }}
                                        className={`w-full rounded-xl relative transition-all duration-300 ${i === 3 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-100 group-hover/bar:bg-slate-200'}`}
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-[10px] font-bold text-slate-900">
                                        {val}d
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/bar:text-slate-900 transition-colors">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Efficiency by Department */}
                <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Department Efficiency</h3>
                    <div className="space-y-8 relative z-10">
                        {[
                            { label: 'Engineering', val: 65 },
                            { label: 'Product', val: 42 },
                            { label: 'Sales', val: 78 },
                            { label: 'Marketing', val: 55 },
                            { label: 'Operations', val: 38 },
                        ].map((dept, i) => (
                            <div key={i} className="space-y-2.5 group/item">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/item:text-primary transition-colors">{dept.label}</span>
                                    <span className="text-sm font-bold text-slate-900">{dept.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-[1px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${dept.val}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                                        className="h-full bg-primary rounded-full shadow-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hiring Sources & Interviewer Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Acquisition Channels */}
                <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm flex flex-col sm:flex-row items-center gap-10 group">
                    <div className="relative size-44 shrink-0">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle className="text-slate-50" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="4" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                whileInView={{ strokeDasharray: "45 100" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5 }}
                                className="text-primary" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDashoffset="0" strokeLinecap="round" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                whileInView={{ strokeDasharray: "25 100" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                                className="text-slate-900" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDashoffset="-45" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-slate-900 tracking-tight">1.2k</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Apps</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-5">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2 px-1">Source Channels</h4>
                        {[
                            { label: 'LinkedIn', val: '45%', color: 'bg-primary' },
                            { label: 'Referrals', val: '25%', color: 'bg-slate-900' },
                            { label: 'Job Boards', val: '15%', color: 'bg-slate-300' },
                            { label: 'Direct', val: '15%', color: 'bg-slate-100' },
                        ].map((source, i) => (
                            <div key={i} className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-3">
                                    <div className={`size-2 rounded-full ${source.color} transition-transform group-hover/row:scale-125`} />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/row:text-slate-900 transition-colors">{source.label}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900">{source.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interviewer Performance */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group">
                    <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Top Interviewers</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Activity over current period</p>
                        </div>
                        <button className="h-9 px-5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm">Detailed List</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Interviewer</th>
                                    <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Sessions</th>
                                    <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</th>
                                    <th className="px-10 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: 'Sarah Jenkins', hits: 32, eff: '98%', rating: 5, seed: 'jenkins' },
                                    { name: 'David Moore', hits: 28, eff: '92%', rating: 4, seed: 'moore' },
                                    { name: 'Elena Rossi', hits: 24, eff: '85%', rating: 4, seed: 'rossi' },
                                ].map((rec, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group/row">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm p-0.5 transition-transform group-hover/row:scale-105">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.seed}`} className="size-full object-cover rounded-lg" alt={rec.name} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{rec.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-bold text-slate-900">{rec.hits}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-bold uppercase tracking-widest">{rec.eff}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                {[...Array(5)].map((_, stars) => (
                                                    <Star key={stars} className={`size-3 ${stars < rec.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Strategic Insight */}
            <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl shadow-black/20 shrink-0">
                        <Lightbulb className="size-8" />
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                            <h5 className="text-xl font-bold text-white tracking-tight">Strategic Insight: Velocity Factor</h5>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Active Tip</span>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed max-w-4xl">
                            Engineering hiring speed has improved by <span className="text-white font-bold">15%</span> after implemented stage-based filtering. Focus on Product roles next to achieve consistent cross-department velocity.
                        </p>
                    </div>
                    <button className="h-14 px-10 bg-white text-slate-900 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 shrink-0">
                        Detailed Analysis
                    </button>
                </div>
            </div>
        </div>
    );
}
