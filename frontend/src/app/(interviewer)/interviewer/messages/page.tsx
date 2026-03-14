'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState('sarah');

    return (
        <div className="h-[calc(100vh-140px)] flex bg-[#080808] rounded-3xl border border-white/5 overflow-hidden">
            {/* Conversation List */}
            <div className="w-80 border-r border-white/5 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Messages_</h3>
                        <button className="size-8 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all">
                            <span className="material-symbols-outlined text-sm">edit_square</span>
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full bg-primary text-white">All</button>
                        <button className="px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full bg-white/5 text-slate-500 hover:text-white transition-colors">Team</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Active Chat Item */}
                    <div className={`p-6 border-b border-white/5 cursor-pointer transition-all ${activeChat === 'sarah' ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-white/[0.02]'}`} onClick={() => setActiveChat('sarah')}>
                        <div className="flex gap-4">
                            <div className="relative shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-12 h-12 rounded-2xl border border-white/10" alt="Sarah" />
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#080808]"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-[11px] font-black text-white uppercase italic truncate">Sarah Jenkins</p>
                                    <span className="text-[9px] text-slate-600 font-bold">10:24 AM</span>
                                </div>
                                <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-1 truncate">Re: Candidate Follow-up</p>
                                <p className="text-[10px] text-slate-500 mt-1 truncate italic">"He mentioned he has another offer..."</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Item */}
                    {[
                        { id: 'marcus', name: 'Marcus Wu', sub: 'Roadmap Feedback', msg: 'The team liked your assessment of...', time: 'Yesterday' },
                        { id: 'jess', name: 'Jessica Day', sub: 'New Candidate Trace', msg: 'Attached portfolio for review.', time: 'Jul 12' }
                    ].map((chat) => (
                        <div key={chat.id} className={`p-6 border-b border-white/5 cursor-pointer transition-all ${activeChat === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-white/[0.02]'}`} onClick={() => setActiveChat(chat.id)}>
                            <div className="flex gap-4">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} className="w-12 h-12 rounded-2xl border border-white/10 grayscale opacity-50" alt={chat.name} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[11px] font-black text-white uppercase italic truncate">{chat.name}</p>
                                        <span className="text-[9px] text-slate-600 font-bold">{chat.time}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{chat.sub}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 truncate">{chat.msg}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-[#030303]/50">
                {/* Chat Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-10 h-10 rounded-2xl border border-white/10" alt="Sarah" />
                        <div>
                            <h4 className="text-[12px] font-black text-white uppercase italic leading-none">Sarah Jenkins</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Active Protocol • Recruiter Lead</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">call</span>
                        </button>
                        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">videocam</span>
                        </button>
                        <div className="w-px h-6 bg-white/5 mx-2"></div>
                        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">info</span>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 h-px bg-white/5"></div>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600">Today // Log 1024_</span>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    {/* Inbound Message */}
                    <div className="flex items-start gap-4 max-w-2xl">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-8 h-8 rounded-xl border border-white/10 mt-1" alt="S" />
                        <div>
                            <div className="bg-[#080808] border border-white/5 p-5 rounded-2xl rounded-tl-none shadow-xl">
                                <p className="text-sm font-bold text-slate-300 leading-relaxed">Hi Alex! I just finished the screening call with David Chen. He seems like a perfect match for the Engineering culture. He mentioned he prefers our company mission over another offer.</p>
                            </div>
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mt-2 block">10:15 AM</span>
                        </div>
                    </div>

                    {/* Outbound Message */}
                    <div className="flex items-start gap-4 flex-row-reverse max-w-2xl ml-auto text-right">
                        <div className="bg-primary p-5 rounded-2xl rounded-tr-none shadow-xl shadow-primary/10">
                            <p className="text-sm font-black text-white italic leading-relaxed">Excellent. Did he demonstrate proficiency with Next.js and the Atomic Design Pattern? We need a heavy lifter for the core architecture.</p>
                        </div>
                    </div>

                    {/* Inbound with Attachments */}
                    <div className="flex items-start gap-4 max-w-2xl">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-8 h-8 rounded-xl border border-white/10 mt-1" alt="S" />
                        <div className="space-y-4">
                            <div className="bg-[#080808] border border-white/5 p-5 rounded-2xl rounded-tl-none shadow-xl">
                                <p className="text-sm font-bold text-slate-300 leading-relaxed">Yes, 3+ years in enterprise-scale React. I've compiled my notes into a PDF and attached his live portfolio link below.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">Screening_Report.pdf</p>
                                        <p className="text-[8px] text-slate-600 uppercase font-black">2.4 MB</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                        <span className="material-symbols-outlined">link</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">dchen.dev/portfolio</p>
                                        <p className="text-[8px] text-slate-600 uppercase font-black">External Live</p>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mt-2 block">10:24 AM</span>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-white/5">
                    <div className="bg-[#080808] border border-white/5 rounded-3xl p-3 focus-within:border-primary/30 transition-all shadow-2xl">
                        <textarea className="w-full bg-transparent border-none focus:ring-0 text-sm italic font-bold text-white placeholder:text-slate-700 resize-none min-h-[60px] px-4 py-2" placeholder="Initialize response protocol..."></textarea>
                        <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-3 px-2">
                            <div className="flex gap-2">
                                <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                    <span className="material-symbols-outlined text-lg">attach_file</span>
                                </button>
                                <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                    <span className="material-symbols-outlined text-lg">mood</span>
                                </button>
                                <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                    <span className="material-symbols-outlined text-lg">mic</span>
                                </button>
                            </div>
                            <button className="h-10 px-8 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                                Send Signal
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Sidebar */}
            <div className="w-72 border-l border-white/5 bg-[#080808]/50 hidden 2xl:flex flex-col">
                <div className="p-8 text-center border-b border-white/5">
                    <div className="relative inline-block">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" className="w-24 h-24 rounded-3xl border-2 border-primary/20 p-1 mx-auto" alt="David" />
                        <span className="absolute -bottom-2 -right-2 bg-primary text-white size-8 rounded-2xl flex items-center justify-center border-4 border-[#080808] shadow-lg">
                            <span className="material-symbols-outlined text-xs">star</span>
                        </span>
                    </div>
                    <h5 className="mt-6 text-sm font-black text-white italic tracking-tighter uppercase">David Chen</h5>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Senior Frontend Engineer Role</p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-lg">In Pipeline</span>
                        <span className="px-3 py-1 bg-white/5 text-slate-400 text-[8px] font-black uppercase tracking-widest border border-white/5 rounded-lg">Final Round</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div>
                        <h6 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 italic">Recent Logs_</h6>
                        <div className="space-y-6">
                            {[
                                { icon: 'calendar_today', label: 'Interview Scheduled', date: 'Tomorrow, 2:00 PM', color: 'text-blue-500' },
                                { icon: 'history_edu', label: 'Assignment Review', date: '3 days ago', color: 'text-purple-500' }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 ${log.color}`}>
                                        <span className="material-symbols-outlined text-lg">{log.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{log.label}</p>
                                        <p className="text-[9px] text-slate-600 font-bold mt-1 tracking-widest">{log.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h6 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 italic">Resource Links_</h6>
                        <div className="space-y-3">
                            <a href="#" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">code</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">GitHub Trace</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-700 text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">description</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Full CV Module</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-700 text-sm">chevron_right</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
