'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            title: 'New Candidate Applied',
            message: 'John Doe has applied for the Senior Frontend Developer position.',
            time: '2 minutes ago',
            type: 'primary',
            icon: 'person_add'
        },
        {
            id: 2,
            title: 'Interview Scheduled',
            message: 'Technical interview with Sarah Smith scheduled for tomorrow at 10:00 AM.',
            time: '1 hour ago',
            type: 'accent',
            icon: 'calendar_month'
        },
        {
            id: 3,
            title: 'Interviewer Feedback',
            message: 'Mark Thompson left feedback for the interview with Alex Johnson.',
            time: '3 hours ago',
            type: 'white',
            icon: 'rate_review'
        }
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Notifications</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-2">Stay updated with the latest activity</p>
            </div>

            <div className="max-w-4xl space-y-4">
                {notifications.map((notif, idx) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#080808] border border-white/5 rounded-2xl p-6 flex items-start gap-5 hover:border-primary/30 transition-all group group/card relative overflow-hidden"
                    >
                        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${
                            notif.type === 'primary' ? 'bg-primary/10 text-primary' : 
                            notif.type === 'accent' ? 'bg-accent/10 text-accent' : 
                            'bg-white/5 text-white'
                        }`}>
                            <span className="material-symbols-outlined">{notif.icon}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-white text-base tracking-tight">{notif.title}</h3>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{notif.time}</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{notif.message}</p>
                        </div>

                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    </motion.div>
                ))}
            </div>

            {notifications.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center bg-[#080808] border border-white/5 border-dashed rounded-3xl">
                    <span className="material-symbols-outlined text-4xl text-slate-700 mb-4">notifications_off</span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No notifications yet</p>
                </div>
            )}
        </div>
    );
}
