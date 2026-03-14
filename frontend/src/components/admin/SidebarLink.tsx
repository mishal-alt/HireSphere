'use client';

import Link from 'next/link';
import React from 'react';

export default function SidebarLink({ icon, label, href, active = false }: { icon: string; label: string; href: string; active?: boolean }) {
    return (
        <Link
            className={`flex items-center h-12 px-5 rounded-lg transition-all group ${active ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            href={href}
        >
            <span className={`material-symbols-outlined text-[20px] shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-primary transition-colors'}`}>{icon}</span>
            <span className="ml-4 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                {label}
            </span>
        </Link>
    );
}
