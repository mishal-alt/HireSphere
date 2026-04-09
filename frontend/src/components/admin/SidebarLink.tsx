'use client';

import Link from 'next/link';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function SidebarLink({ icon, label, href, active = false, isCollapsed = false }: { icon: string; label: string; href: string; active?: boolean; isCollapsed?: boolean }) {
    const IconComponent = (LucideIcons as any)[icon];

    return (
        <Link
            className={`sidebar-link-item opacity-0 flex items-center h-10 px-3 rounded-md transition-all duration-200 group relative ${active ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'} ${isCollapsed ? 'justify-center w-10 px-0 mx-auto' : 'w-full'}`}
            href={href}
            title={isCollapsed ? label : ''}
        >
            <div className={`flex items-center relative z-10 ${isCollapsed ? 'justify-center' : 'w-full'}`}>
                {IconComponent && (
                    <IconComponent className={`size-[18px] shrink-0 transition-colors duration-200 ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                )}
                {!isCollapsed && (
                    <span className={`ml-3 text-sm transition-colors duration-200 whitespace-nowrap ${active ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {label}
                    </span>
                )}
            </div>
        </Link>
    );
}
