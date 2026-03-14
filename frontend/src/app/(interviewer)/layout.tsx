'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SidebarLink from '@/components/admin/SidebarLink';
import InterviewerHeader from '@/components/interviewer/InterviewerHeader';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function InterviewerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, initialized, company, checkAuth, fetchCompany, logout } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    useEffect(() => {
        if (initialized && !user) {
            router.push('/login');
        }
    }, [initialized, user, router]);

    useEffect(() => {
        if (user && !company) {
            fetchCompany();
        }
    }, [user, company, fetchCompany]);

    const companyDisplayName = company?.name || 'HireSphere';

    return (
        <div className="flex h-screen bg-[#030303] text-slate-300 font-display overflow-hidden selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-20 hover:w-64 bg-[#080808] border-r border-white/5 flex flex-col transition-all duration-500 z-50 group/sidebar overflow-hidden shrink-0 shadow-2xl">
                {/* Logo Area */}
                <div className="p-6 flex items-center h-20 shrink-0">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-xl">bubble_chart</span>
                    </div>
                    <div className="ml-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap flex flex-col">
                        <span className="text-lg font-bold text-white tracking-tight leading-tight uppercase">{companyDisplayName}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Interviewer Portal</span>
                    </div>
                </div>

                <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <SidebarLink icon="dashboard" label="Dashboard" href="/interviewer/dashboard" active={pathname === '/interviewer/dashboard'} />
                    <SidebarLink icon="groups" label="My Interviews" href="/interviewer/interviews" active={pathname === '/interviewer/interviews'} />
                    <SidebarLink icon="person_search" label="Candidates" href="/interviewer/candidates" active={pathname === '/interviewer/candidates'} />
                    <SidebarLink icon="assignment" label="Evaluations" href="/interviewer/evaluations" active={pathname === '/interviewer/evaluations'} />
                    <SidebarLink icon="chat_bubble" label="Messages" href="/interviewer/messages" active={pathname === '/interviewer/messages'} />
                    <SidebarLink icon="calendar_month" label="Calendar" href="/interviewer/calendar" active={pathname === '/interviewer/calendar'} />
                    <SidebarLink icon="settings" label="Settings" href="/interviewer/settings" active={pathname === '/interviewer/settings'} />
                </div>

                <div className="p-4 mt-auto border-t border-white/5 group/logout">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full h-11 px-4 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all overflow-hidden"
                    >
                        <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
                        <span className="ml-4 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                            Logout Portal
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                <InterviewerHeader />
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#030303]">
                    <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
