'use client';

import Link from 'next/link';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

export default function SidebarLink({ icon, label, href, active = false }: { icon: string; label: string; href: string; active?: boolean }) {
    const IconComponent = (LucideIcons as any)[icon];

    return (
        <Link
            className={`flex items-center h-11 px-5 rounded-xl transition-all group relative ${active
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            href={href}
        >
            <div className="flex items-center relative z-10 w-full">
                {IconComponent && (
                    <IconComponent className={`size-[18px] shrink-0 transition-transform ${active 
                        ? 'text-white scale-110' 
                        : 'text-slate-400 group-hover:text-slate-900 group-hover:scale-110'
                    }`} />
                )}
                <span className={`ml-4 text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'text-white opacity-100' : 'text-slate-500 group-hover:text-slate-900'
                    }`}>
                    {label}
                </span>
                
                {active && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto size-1.5 rounded-full bg-white opacity-40 shadow-sm"
                    />
                )}
            </div>
        </Link>
    );
}
