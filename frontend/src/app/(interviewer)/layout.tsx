'use client';

import React, { useEffect, useState } from 'react';
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
    Command,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function InterviewerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, initialized, company, checkAuth, fetchCompany, logout } = useAuthStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const isInterviewRoom = pathname.startsWith('/interviewer/interview-room/');

    if (isInterviewRoom) {
        return (
            <div className="h-screen w-screen bg-white font-sans overflow-hidden">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200/50 flex flex-col z-40 shrink-0 transition-all duration-300 ease-in-out`}>
                {/* Logo Area */}
                <div className={`px-4 py-5 flex items-center h-16 shrink-0 overflow-hidden relative group ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    <div className="size-8 bg-white border border-gray-200/50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-none p-1">
                        <img src={logoUrl || "/logo.png"} className="size-full object-contain" alt="Brand" />
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 flex flex-col min-w-0 transition-opacity duration-300">
                            <span className="text-sm font-semibold text-gray-900 truncate">{companyDisplayName}</span>
                            <span className="text-xs text-gray-500 truncate">Expert Portal</span>
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
                                <p className="text-xs font-medium text-gray-500">Main Menu</p>
                            </div>
                        )}
                        <div className="space-y-0.5">
                            <SidebarLink icon="LayoutDashboard" label="Overview" href="/interviewer/dashboard" active={pathname === '/interviewer/dashboard'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="UserCheck" label="My Sessions" href="/interviewer/interviews" active={pathname === '/interviewer/interviews'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="Users" label="Directory" href="/interviewer/candidates" active={pathname === '/interviewer/candidates'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="ClipboardList" label="Assessments" href="/interviewer/evaluations" active={pathname === '/interviewer/evaluations'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="MessageSquare" label="Messages" href="/interviewer/messages" active={pathname === '/interviewer/messages'} isCollapsed={isCollapsed} />
                            <SidebarLink icon="Calendar" label="Calendar" href="/interviewer/calendar" active={pathname === '/interviewer/calendar'} isCollapsed={isCollapsed} />
                        </div>
                    </div>

                    <div>
                        {!isCollapsed && (
                            <div className="px-3 mb-2">
                                <p className="text-xs font-medium text-gray-500">Preferences</p>
                            </div>
                        )}
                        <div className="space-y-0.5">
                            <SidebarLink icon="Settings" label="Account Settings" href="/interviewer/settings" active={pathname === '/interviewer/settings'} isCollapsed={isCollapsed} />
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
                                <span className="text-xs text-gray-500 truncate">Interviewer</span>
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
                <InterviewerHeader />
                <main className="flex-1 overflow-y-auto">
                    <div className={pathname === '/interviewer/messages' ? 'h-full w-full' : 'max-w-[1400px] mx-auto p-8 h-full'}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
