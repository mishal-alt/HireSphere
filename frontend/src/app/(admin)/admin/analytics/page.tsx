'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    return (
        <div className="space-y-16 pb-20 relative">
            {/* Cinematic Intelligence Header */}
            <div className="relative overflow-hidden rounded-[3rem] p-12 lg:p-20 border border-white/5 bg-[#030303] group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-display font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            Insight Core: Active
                        </motion.div>
                        <h1 className="text-7xl md:text-[8rem] font-heading font-extrabold text-white tracking-tighter leading-[0.85]">
                            Analytics <br /> <span className="text-gradient italic font-normal">Intelligence.</span>
                        </h1>
                    </div>

                    <div className="flex flex-col gap-6 items-end">
                        <div className="relative group/btn">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            <button className="relative z-10 h-20 px-10 bg-white text-black font-display font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="material-symbols-outlined">download</span>
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Metrics Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                {[
                    { label: 'Total Hires', val: '128', growth: '+12%', icon: 'ads_click', color: 'text-white' },
                    { label: 'Time-to-Hire', val: '24d', growth: '-3%', icon: 'timer', color: 'text-orange-400' },
                    { label: 'Acceptance Rate', val: '82%', growth: '-2%', icon: 'handshake', color: 'text-amber-400' },
                    { label: 'Active Pipeline', val: '45', growth: '+5%', icon: 'dynamic_feed', color: 'text-primary' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-10 rounded-[2.5rem] border-white/5 border-white/5 bg-[#050505] group hover:border-white/10 transition-all"
                    >
                        <p className="text-[10px] font-display font-black uppercase tracking-widest text-slate-500 mb-6">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-5xl font-display font-black text-white">{stat.val}</h3>
                            <span className={`text-[10px] font-display font-black ${stat.growth.startsWith('+') ? 'text-emerald-400' : 'text-orange-400'} uppercase tracking-widest mb-1`}>{stat.growth}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Trend Plane */}
                <div className="lg:col-span-8 glass-card rounded-[3rem] border border-white/5 p-12 bg-[#030303] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-16">
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tight italic">Velocity Trend</h3>
                        <select className="bg-white/5 border border-white/5 rounded-full px-6 py-2 text-[10px] font-display font-black uppercase tracking-widest text-slate-400 outline-none hover:border-white/20 transition-all">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>

                    <div className="h-72 flex items-end justify-between gap-6">
                        {[60, 75, 55, 85, 65, 60].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar relative">
                                <div className="w-full relative h-full flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ delay: i * 0.1, duration: 1.5, ease: 'easeOut' }}
                                        className={`w-full rounded-2xl relative transition-all duration-500 ${i === 2 ? 'bg-primary shadow-[0_0_30px_rgba(80,72,229,0.3)]' : 'bg-white/5 group-hover/bar:bg-white/10'}`}
                                    />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-xs font-display font-black text-white tracking-widest">
                                        {val}d
                                    </div>
                                </div>
                                <span className="text-[9px] font-display font-black text-slate-600 uppercase tracking-[0.3em] group-hover/bar:text-white transition-colors">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Efficiency Distribution */}
                <div className="lg:col-span-4 glass-card rounded-[3rem] border border-white/5 p-12 bg-[#030303]">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight italic mb-10">Efficiency Index</h3>
                    <div className="space-y-10">
                        {[
                            { label: 'Engineering', val: 65 },
                            { label: 'Product', val: 42 },
                            { label: 'Sales', val: 78 },
                            { label: 'Marketing', val: 55 },
                            { label: 'Operations', val: 38 },
                        ].map((dept, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] font-display font-black text-slate-400 uppercase tracking-widest">{dept.label}</span>
                                    <span className="text-sm font-display font-black text-white italic">{dept.val}%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dept.val}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 2 }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Roster & Channel Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recruitment Channel Circular Logic */}
                <div className="lg:col-span-5 glass-card rounded-[3rem] border border-white/5 p-12 bg-[#030303] flex items-center gap-12">
                    <div className="relative size-48 shrink-0">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle className="text-white/5" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: "45 100" }}
                                transition={{ duration: 2 }}
                                className="text-primary" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDashoffset="0" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: "25 100" }}
                                transition={{ duration: 2, delay: 0.5 }}
                                className="text-indigo-400" cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDashoffset="-45" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-display font-black text-white">1.2k</span>
                            <span className="text-[8px] text-slate-500 font-display font-black uppercase tracking-widest">APPS</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        {[
                            { label: 'LinkedIn', val: '45%', color: 'bg-primary' },
                            { label: 'Referrals', val: '25%', color: 'bg-indigo-400' },
                            { label: 'Direct', val: '15%', color: 'bg-white/10' },
                            { label: 'Others', val: '15%', color: 'bg-white/5' },
                        ].map((source, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-2 rounded-full ${source.color}`} />
                                    <span className="text-[10px] font-display font-black text-slate-500 uppercase tracking-widest">{source.label}</span>
                                </div>
                                <span className="text-sm font-display font-black text-white italic">{source.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance HUD Table */}
                <div className="lg:col-span-7 glass-card rounded-[3rem] border border-white/5 bg-[#030303] overflow-hidden">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <h4 className="text-lg font-display font-black text-white uppercase tracking-tight italic">Operations Roster</h4>
                        <button className="text-[9px] font-display font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Audit Full Console</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.01]">
                                    <th className="px-10 py-6 text-[10px] font-display font-black text-slate-600 uppercase tracking-widest">Operator</th>
                                    <th className="px-10 py-6 text-[10px] font-display font-black text-slate-600 uppercase tracking-widest text-center">Output</th>
                                    <th className="px-10 py-6 text-[10px] font-display font-black text-slate-600 uppercase tracking-widest">Efficiency</th>
                                    <th className="px-10 py-6 text-[10px] font-display font-black text-slate-600 uppercase tracking-widest text-right">Index</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: 'Sarah Jenkins', hits: 32, eff: '98%', rating: 5, seed: 'sarah' },
                                    { name: 'David Moore', hits: 28, eff: '92%', rating: 4, seed: 'david' },
                                    { name: 'Elena Rossi', hits: 24, eff: '85%', rating: 4, seed: 'elena' },
                                ].map((rec, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.seed}`} className="size-8 rounded-lg bg-white/5" alt={rec.name} />
                                                <span className="text-sm font-display font-black text-white uppercase italic tracking-tight">{rec.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="text-sm font-display font-black text-white">{rec.hits}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-display font-black uppercase tracking-widest">{rec.eff}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                {[...Array(5)].map((_, stars) => (
                                                    <span key={stars} className={`material-symbols-outlined text-[10px] ${stars < rec.rating ? 'text-amber-500 fill-1' : 'text-slate-700'}`}>star</span>
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

            {/* AI Intelligence Snippet */}
            <div className="glass-card p-12 rounded-[3.5rem] border border-primary/20 bg-gradient-to-r from-primary/10 via-[#030303] to-transparent relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="size-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-[0_0_40px_rgba(80,72,229,0.5)] animate-pulse shrink-0">
                        <span className="material-symbols-outlined text-3xl">lightbulb</span>
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h5 className="text-xl font-display font-black text-white uppercase italic tracking-tight">Intelligence Node: Engineering Velocity</h5>
                        <p className="text-sm text-slate-400 font-display font-black uppercase leading-relaxed tracking-widest max-w-3xl">
                            Engineering hiring velocity has accelerated by <span className="text-primary italic">15%</span> following the implementation of Phase 2 automated filtering. Architecture recommendation: Apply logic to Product nodes.
                        </p>
                    </div>
                    <button className="h-14 px-10 bg-white text-black font-display font-black rounded-full text-[9px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shrink-0">
                        Explore Full Audit
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                    <span className="material-symbols-outlined text-[15rem]">architecture</span>
                </div>
            </div>
        </div>
    );
}
