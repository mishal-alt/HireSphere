'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SidebarLink from '@/components/admin/SidebarLink';
import InterviewerHeader from '@/components/interviewer/InterviewerHeader';
import { useAuthStore } from '@/store/useAuthStore';
import {
    LayoutDashboard,
    UserCheck,
    Users,
    ClipboardList,
    MessageSquare,
    Calendar,
    Settings,
    LogOut,
    Hexagon,
    ShieldCheck,
    ChevronRight,
    Search,
    Command
} from 'lucide-react';

export default function InterviewerLayout({ children }: { children: React.ReactNode }) {
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

    const profileImageUrl = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Interviewer'}`;

    const logoUrl = company?.logoUrl
        ? (company.logoUrl.startsWith('http') ? company.logoUrl : `${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`)
        : null;

    return (
        <div className="flex h-screen bg-[#FDFDFF] text-slate-900 font-sans overflow-hidden selection:bg-primary/20">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-100 flex flex-col z-40 shrink-0 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-all duration-300">
                {/* Logo Area */}
                <div className="px-8 py-10 flex items-center h-24 shrink-0 border-b border-slate-50 overflow-hidden relative group">
                    <div className="size-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-2xl group-hover:rotate-6 transition-transform">
                        <img src={logoUrl || "/logo.png"} className="size-full object-contain p-1" alt="Brand" />
                    </div>
                    <div className="ml-4 flex flex-col min-w-0 transition-transform group-hover:translate-x-0.5">
                        <span className="text-sm font-bold text-slate-900 tracking-tight leading-tight truncate uppercase">{companyDisplayName}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 shrink-0">Expert Portal</span>
                    </div>
                </div>

                <div className="flex-1 px-5 py-10 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="px-5 mb-4">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Main Menu</p>
                    </div>
                    <div className="space-y-1.5 focus-within:z-10 relative">
                        <SidebarLink icon="LayoutDashboard" label="Overview" href="/interviewer/dashboard" active={pathname === '/interviewer/dashboard'} />
                        <SidebarLink icon="UserCheck" label="My Sessions" href="/interviewer/interviews" active={pathname === '/interviewer/interviews'} />
                        <SidebarLink icon="Users" label="Directory" href="/interviewer/candidates" active={pathname === '/interviewer/candidates'} />
                        <SidebarLink icon="ClipboardList" label="Assessments" href="/interviewer/evaluations" active={pathname === '/interviewer/evaluations'} />
                        <SidebarLink icon="MessageSquare" label="Messages" href="/interviewer/messages" active={pathname === '/interviewer/messages'} />
                        <SidebarLink icon="Calendar" label="Calendar" href="/interviewer/calendar" active={pathname === '/interviewer/calendar'} />
                    </div>

                    <div className="px-5 mt-12 mb-4">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Preferences</p>
                    </div>
                    <div className="space-y-1.5 focus-within:z-10 relative">
                        <SidebarLink icon="Settings" label="Account Settings" href="/interviewer/settings" active={pathname === '/interviewer/settings'} />
                    </div>
                </div>

                {/* Profile Section & Logout */}
                <div className="px-6 py-8 mt-auto border-t border-slate-50 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] group cursor-pointer hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all">
                        <div className="size-11 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-white shrink-0">
                            <img src={profileImageUrl} className="size-full object-cover transition-transform group-hover:scale-110" alt="Identity" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-bold text-slate-900 truncate uppercase tracking-tight">{user?.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="size-1.5 rounded-full bg-emerald-500 shadow-sm" />
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Interviewer</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-between w-full h-12 px-6 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all group border border-transparent hover:border-rose-100 shadow-sm hover:shadow-rose-500/5"
                    >
                        <div className="flex items-center">
                            <LogOut className="size-4 shrink-0 transition-transform group-hover:rotate-12" />
                            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest">
                                Sign Out
                            </span>
                        </div>
                        <ChevronRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <InterviewerHeader />
                <main className={`flex-1 overflow-hidden bg-[#FAFBFF]`}>
                    <div className={pathname === '/interviewer/messages' ? 'h-full w-full' : 'max-w-[1500px] mx-auto p-10 lg:p-14 overflow-y-auto h-full custom-scrollbar'}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
