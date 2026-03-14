'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messagesList = [
    { id: 'sarah', name: 'Sarah Miller', sub: 'Candidate Update', msg: "Check John's interview report.", time: '10:42 AM', status: 'Online', role: 'HR Manager', seed: 'sarah' },
    { id: 'david', name: 'David Chen', sub: 'Job Application', msg: 'The candidate is waiting for the interview.', time: 'Yesterday', status: 'Away', role: 'Team Lead', seed: 'david' },
    { id: 'marcus', name: 'Marcus Rodriguez', sub: 'New Resume', msg: 'A new developer portfolio was uploaded.', time: 'Mon', status: 'Offline', role: 'Design Lead', seed: 'marcus' },
];

export default function AdminMessagesPage() {
    const [activeChat, setActiveChat] = useState('sarah');
    const [messageInput, setMessageInput] = useState('');

    const currentChat = messagesList.find(c => c.id === activeChat) || messagesList[0];

    return (
        <div className="h-[calc(100vh-160px)] flex bg-[#080808] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
            {/* Thread Navigation Plane */}
            <div className="w-80 md:w-96 border-r border-white/5 flex flex-col shrink-0 bg-[#030303]/50">
                <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Messages</h2>
                        <button className="size-11 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
                            <span className="material-symbols-outlined text-sm">edit_square</span>
                        </button>
                    </div>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
                        <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl bg-primary text-white shadow-lg shadow-primary/20">All</button>
                        <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl text-slate-500 hover:text-white transition-all">Direct</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {messagesList.map((chat) => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChat(chat.id)}
                            className={`group p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${
                                activeChat === chat.id 
                                ? 'bg-primary/10 border-primary/20 shadow-inner' 
                                : 'bg-transparent border-transparent hover:bg-white/[0.03]'
                            }`}
                        >
                            <div className="relative z-10 flex gap-5">
                                <div className="relative shrink-0">
                                    <div className={`size-14 rounded-2xl overflow-hidden border-2 transition-all ${activeChat === chat.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/10 grayscale opacity-80'}`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.seed}`} alt={chat.name} />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-4 border-[#030303] ${
                                        chat.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                                        chat.status === 'Away' ? 'bg-amber-500' : 'bg-slate-600'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm font-black tracking-tight uppercase ${activeChat === chat.id ? 'text-white' : 'text-slate-400'}`}>{chat.name}</h3>
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{chat.time}</span>
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-[0.1em] mt-1 truncate ${activeChat === chat.id ? 'text-primary' : 'text-slate-500'}`}>{chat.sub}</p>
                                    <p className="text-[10px] font-bold text-slate-600 truncate mt-1">"{chat.msg}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversation Stream Plane */}
            <div className="flex-1 flex flex-col bg-[#030303]/80 relative backdrop-blur-3xl">
                {/* Channel Header */}
                <div className="h-28 px-10 border-b border-white/5 flex items-center justify-between bg-[#080808]/50 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    </div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="size-16 rounded-3xl overflow-hidden border-2 border-primary/30 p-1 bg-[#0a0a0a]">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat.seed}`} alt="User" className="size-full rounded-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{currentChat.name}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${currentChat.status === 'Online' ? 'text-emerald-500' : 'text-slate-500'}`}>{currentChat.status}</span>
                                <span className="text-slate-800">•</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{currentChat.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        {[
                            { icon: 'videocam', label: 'Call' },
                            { icon: 'search', label: 'Search' },
                            { icon: 'more_vert', label: 'Options' },
                        ].map(action => (
                            <button key={action.icon} className="h-12 w-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 group">
                                <span className="material-symbols-outlined text-xl group-hover:scale-110">{action.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message Flow */}
                <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                    <div className="flex flex-col items-center gap-4">
                        <div className="px-6 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Today</div>
                    </div>

                    {/* Received Message Bundle */}
                    <div className="flex gap-6 max-w-2xl">
                        <div className="size-10 rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] self-end mb-2 shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat.seed}`} alt="User" />
                        </div>
                        <div className="space-y-4">
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] rounded-bl-none shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-l-4 border-l-primary/30"
                                >
                                    <p className="text-sm font-bold text-slate-300 leading-relaxed italic">Hi, I've just finished the interview for the developer role. The results are great. I've attached the report below for you to check.</p>
                                </motion.div>
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-5 group cursor-pointer hover:border-primary/50 transition-all shadow-xl"
                            >
                                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-[0_0_20px_rgba(80,72,229,0.3)]">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest truncate italic">Interview_Report.pdf</p>
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">4.8 MB • PDF Document</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary group-hover:translate-y-1 transition-all">download</span>
                            </motion.div>
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-2">Received 10:42 AM</span>
                        </div>
                    </div>

                    {/* Sent Message Bundle */}
                    <div className="flex gap-6 max-w-2xl ml-auto flex-row-reverse">
                        <div className="size-10 rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/10 self-end mb-2 shrink-0 flex items-center justify-center shadow-lg shadow-primary/10">
                            <span className="text-[10px] font-black text-primary italic">ADM</span>
                        </div>
                        <div className="space-y-4 text-right">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-primary p-8 rounded-[2.5rem] rounded-br-none shadow-[0_20px_80px_rgba(80,72,229,0.2)] text-left"
                            >
                                <p className="text-sm font-black text-white leading-relaxed italic uppercase tracking-wider">Got it. Let's schedule the final talk for Thursday. Make sure the lead developer can join.</p>
                            </motion.div>
                            <div className="flex items-center justify-end gap-3 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mr-2">
                                Message Sent
                                <span className="material-symbols-outlined text-primary text-sm">done_all</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Matrix */}
                <div className="p-10 border-t border-white/5 bg-[#080808]/80 backdrop-blur-xl">
                    <div className="relative flex items-center gap-6 bg-[#030303] border border-white/10 rounded-[3rem] p-4 pr-8 focus-within:border-primary/50 transition-all group shadow-2xl">
                        <button className="size-14 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-white/5 shrink-0 group-hover:rotate-12">
                            <span className="material-symbols-outlined text-2xl">attachment</span>
                        </button>
                        <textarea
                            rows={1}
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="flex-1 bg-transparent border-none text-white font-black italic text-[12px] uppercase tracking-widest placeholder:text-slate-800 outline-none resize-none no-scrollbar py-2"
                        />
                        <div className="flex items-center gap-6 border-l border-white/5 pl-8 shrink-0">
                            <button className="text-slate-600 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-2xl">mic</span>
                            </button>
                            <button className="size-14 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-[0_10px_40px_rgba(80,72,229,0.4)] hover:scale-105 active:scale-95 transition-all group/send overflow-hidden relative">
                                <span className="material-symbols-outlined group-hover:translate-x-12 transition-all">send</span>
                                <span className="material-symbols-outlined absolute -translate-x-12 group-hover:translate-x-0 transition-all">bolt</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between px-10">
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] flex items-center gap-3">
                            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            Secure connection active
                        </p>
                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Press Enter to Send</p>
                    </div>
                </div>
            </div>

            {/* Right Context Pane */}
            <div className="w-80 border-l border-white/5 bg-[#080808]/50 hidden 2xl:flex flex-col p-10 space-y-12">
                <div className="text-center space-y-6 pt-10 border-b border-white/5 pb-10">
                    <div className="relative inline-block">
                        <div className="size-32 rounded-[2.5rem] border-2 border-primary/20 p-2 bg-[#0a0a0a]">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat.seed}`} className="size-full rounded-[2rem]" alt="Profile" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl border-4 border-[#080808] text-white">
                            <span className="material-symbols-outlined text-sm">verified_user</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter">{currentChat.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{currentChat.role}</p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Stats</h5>
                        <div className="space-y-3">
                            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Hires</p>
                                <p className="text-2xl font-black text-white italic tracking-tighter mt-1">128</p>
                            </div>
                            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rating</p>
                                <p className="text-2xl font-black text-primary italic tracking-tighter mt-1">9.8</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
