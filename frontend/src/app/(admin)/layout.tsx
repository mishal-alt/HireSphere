'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { animate, stagger } from 'animejs';
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
    ChartBar,
    MessageSquare,
    Settings,
    LogOut,
    Search,
    ShieldCheck,
    Box,
    Layers,
    ChevronRight,
    Command,
    ChevronsLeft,
    ChevronsRight,
    CreditCard,
    Zap,
    Sparkles,
    Building2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, initialized, company, checkAuth, fetchCompany, logout } = useAuthStore();
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        // 💫 Peek-a-boo Reveal Animation
        const timer = setTimeout(() => {
            setIsCollapsed(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

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

    useEffect(() => {
        // 🏰 Perfect Admin Sidebar Choreography
        if (initialized && user) {
            animate('.sidebar-link-item', {
                translateX: [-20, 0],
                opacity: [0, 1],
                delay: stagger(30),
                duration: 600,
                easing: 'easeOutExpo'
            });
        }
    }, [initialized, user, isCollapsed]);

    return (
        <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200/50 flex flex-col z-40 shrink-0 transition-all duration-300 ease-in-out`}>
                {/* Logo Area */}
                <div className={`px-4 py-5 flex items-center h-16 shrink-0 overflow-hidden relative group ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    <div className="size-10 bg-white border border-gray-200/50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm p-1.5 ml-1">
                        {logoUrl ? (
                            <img src={logoUrl} className="size-full object-contain" alt="Brand" />
                        ) : (
                            <Building2 className="size-5 text-gray-400 group-hover:text-emerald-800 transition-colors" />
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 flex flex-col min-w-0 transition-opacity duration-300">
                            <span className="text-sm font-semibold text-gray-900 truncate">{companyDisplayName}</span>
                            <span className="text-xs text-gray-500 truncate">Workspace</span>
                        </div>
                    )}

                    {/* Notion-style Collapse Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`absolute top-5 transition-all duration-300 hover:bg-gray-100 p-1 rounded-md text-gray-400 hover:text-gray-900 ${isCollapsed ? 'relative top-0' : 'right-4 opacity-0 group-hover:opacity-100'}`}
                    >
                        {isCollapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
                    </button>
                </div>

                <div className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-6 overflow-y-auto custom-scrollbar`}>
                    <div>
                        {!isCollapsed && (
                            <div className="px-3 mb-2">
                                <p className="text-xs font-medium text-gray-500">General</p>
                            </div>
                        )}
                        <div className="space-y-0.5">
                            <SidebarLink icon="LayoutDashboard" label="Dashboard" href="/admin/dashboard" active={pathname === '/admin/dashboard'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="Users" label="Candidates" href="/admin/candidates" active={pathname === '/admin/candidates'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="UserCheck" label="Interviewers" href="/admin/interviewers" active={pathname === '/admin/interviewers'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="CalendarDays" label="Interviews" href="/admin/interviews" active={pathname === '/admin/interviews'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="Briefcase" label="Jobs" href="/admin/jobs" active={pathname === '/admin/jobs'} isCollapsed={isCollapsed} />
                        </div>
                    </div>

                    <div>
                        {!isCollapsed && (
                            <div className="px-3 mb-2">
                                <p className="text-xs font-medium text-gray-500">Platform</p>
                            </div>
                        )}
                        <div className="space-y-0.5">
                            <SidebarLink icon="Calendar" label="Calendar" href="/admin/calendar" active={pathname === '/admin/calendar'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="ChartBar" label="Analytics" href="/admin/analytics" active={pathname === '/admin/analytics'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="MessageSquare" label="Messages" href="/admin/messages" active={pathname === '/admin/messages'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="Settings" label="Settings" href="/admin/settings" active={pathname === '/admin/settings'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="CreditCard" label="Plan " href="/admin/pricing" active={pathname === '/admin/pricing'} isCollapsed={isCollapsed} />
                        </div>
                    </div>
                </div>

                {/* Profile Section & Logout */}
                <div className={`p-3 mt-auto border-t border-gray-100 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                    <div className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="size-8 rounded-md overflow-hidden bg-gray-200 shrink-0">
                            <img src={profileImageUrl} className="size-full object-cover" alt="Identity" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 flex-1 transition-opacity duration-300">
                                <span className="text-sm font-medium text-gray-900 truncate">{user?.name}</span>
                                <span className="text-xs text-gray-500 truncate">Admin</span>
                            </div>
                        )}
                        {!isCollapsed && (
                            <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-200">
                                <LogOut className="size-4" />
                            </Button>
                        )}
                    </div>
                    {isCollapsed && (
                        <button onClick={handleLogout} title="Logout" className="w-full flex justify-center p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md mt-2">
                            <LogOut className="size-4" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-white">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto">
                    <div className={pathname === '/admin/messages' ? 'h-full w-full' : 'max-w-[1400px] mx-auto p-8 h-full'}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
