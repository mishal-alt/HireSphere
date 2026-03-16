'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SidebarLink from '@/components/admin/SidebarLink';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, initialized, company, checkAuth, fetchCompany, logout } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const companyDisplayName = company?.name || 'HireSphere';

    return (
        <div className="flex h-screen bg-[#030303] text-slate-300 font-display overflow-hidden selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-20 hover:w-64 bg-[#080808] border-r border-white/5 flex flex-col transition-all duration-500 z-50 group/sidebar overflow-hidden shrink-0 shadow-2xl">
                {/* Logo Area */}
                <div className="p-6 flex items-center h-20 shrink-0">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-xl">bolt</span>
                    </div>
                    <div className="ml-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap flex flex-col">
                        <span className="text-lg font-bold text-white tracking-tight leading-tight">HireSphere</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{companyDisplayName}</span>
                    </div>
                </div>

                <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <SidebarLink icon="dashboard" label="Dashboard" href="/admin/dashboard" active={pathname === '/admin/dashboard'} />
                    <SidebarLink icon="group" label="Candidates" href="/admin/candidates" active={pathname === '/admin/candidates'} />
                    <SidebarLink icon="fact_check" label="Interviewers" href="/admin/interviewers" active={pathname === '/admin/interviewers'} />
                    <SidebarLink icon="calendar_today" label="Interviews" href="/admin/interviews" active={pathname === '/admin/interviews'} />
                    <SidebarLink icon="work" label="Jobs" href="/admin/jobs" active={pathname === '/admin/jobs'} />
                    <SidebarLink icon="calendar_month" label="Calendar" href="/admin/calendar" active={pathname === '/admin/calendar'} />
                    <SidebarLink icon="analytics" label="Reports" href="/admin/analytics" active={pathname === '/admin/analytics'} />
                    <SidebarLink icon="chat" label="Messages" href="/admin/messages" active={pathname === '/admin/messages'} />
                    <SidebarLink icon="settings" label="Settings" href="/admin/settings" active={pathname === '/admin/settings'} />
                </div>

                <div className="p-4">
                    <div className="bg-primary/10 rounded-xl p-4 group/card relative overflow-hidden transition-all h-12 group-hover/sidebar:h-auto">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">stars</span>
                            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Pro Account</p>
                                <p className="text-[9px] text-slate-500 mt-0.5">Use every feature</p>
                            </div>
                        </div>
                        <button className="mt-4 w-full h-9 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover/sidebar:opacity-100 transition-all hover:opacity-90">Upgrade Plan</button>
                    </div>
                </div>
                <div className="p-4 mt-auto group/logout">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full h-11 px-4 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all overflow-hidden"
                    >
                        <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
                        <span className="ml-4 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                            Logout System
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#030303]">
                    <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
