'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SidebarLink from '@/components/admin/SidebarLink';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/store/useAuthStore';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CalendarDays,
    Briefcase,
    Calendar,
    BarChart3,
    MessageSquare,
    Settings,
    LogOut,
    Search,
    ShieldCheck,
    Box,
    Layers,
    ChevronRight,
    Command
} from 'lucide-react';

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

    const profileImageUrl = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`;

    const logoUrl = company?.logoUrl
        ? (company.logoUrl.startsWith('http') ? company.logoUrl : `${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`)
        : null;

    return (
        <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-body overflow-hidden selection:bg-primary/20">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-40 shrink-0 transition-all duration-300">
                {/* Logo Area */}
                <div className="px-8 py-8 flex items-center h-20 shrink-0 border-b border-slate-100 overflow-hidden relative group">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                        <img src={logoUrl || "/logo.png"} className="size-full object-contain p-2 grayscale invert brightness-0" alt="Brand" />
                    </div>
                    <div className="ml-4 flex flex-col min-w-0">
                        <span className="text-sm font-black text-slate-800 tracking-tight leading-tight truncate">{companyDisplayName}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 shrink-0">Workspace</span>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="px-4 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">General</p>
                    </div>
                    <div className="space-y-1">
                        <SidebarLink icon="LayoutDashboard" label="Dashboard" href="/admin/dashboard" active={pathname === '/admin/dashboard'} />
                        <SidebarLink icon="Users" label="Candidates" href="/admin/candidates" active={pathname === '/admin/candidates'} />
                        <SidebarLink icon="UserCheck" label="Interviewers" href="/admin/interviewers" active={pathname === '/admin/interviewers'} />
                        <SidebarLink icon="CalendarDays" label="Interviews" href="/admin/interviews" active={pathname === '/admin/interviews'} />
                        <SidebarLink icon="Briefcase" label="Jobs" href="/admin/jobs" active={pathname === '/admin/jobs'} />
                    </div>

                    <div className="px-4 mt-8 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</p>
                    </div>
                    <div className="space-y-1">
                        <SidebarLink icon="Calendar" label="Calendar" href="/admin/calendar" active={pathname === '/admin/calendar'} />
                        <SidebarLink icon="BarChart3" label="Analytics" href="/admin/analytics" active={pathname === '/admin/analytics'} />
                        <SidebarLink icon="MessageSquare" label="Messages" href="/admin/messages" active={pathname === '/admin/messages'} />
                        <SidebarLink icon="Settings" label="Settings" href="/admin/settings" active={pathname === '/admin/settings'} />
                    </div>
                </div>

                {/* Profile Section & Logout */}
                <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                        <div className="size-9 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            <img src={profileImageUrl} className="size-full object-cover" alt="Identity" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 truncate">{user?.name}</span>
                            <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Admin</span>
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors">
                            <LogOut className="size-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
                    <div className={pathname === '/admin/messages' ? 'h-full w-full' : 'max-w-[1400px] mx-auto p-8 lg:p-12 h-full'}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
