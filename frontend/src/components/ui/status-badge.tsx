'use client';

import React from 'react';

interface StatusBadgeProps {
    status: string;
    score?: number;
}

export function StatusBadge({ status, score }: StatusBadgeProps) {
    // Override 'New' status if score is low
    const effectiveStatus = (status === 'New' && typeof score === 'number' && score < 70) 
        ? 'Rejected' 
        : status;

    const styles: Record<string, string> = {
        'Hired': 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
        'Hired (Signed)': 'text-emerald-800 bg-emerald-100 border-emerald-300',
        'Offered': 'text-indigo-700 bg-indigo-50 border-indigo-200/50',
        'Scheduled': 'text-blue-700 bg-blue-50 border-blue-200/50',
        'New': 'text-amber-700 bg-amber-50 border-amber-200/50',
        'Shortlisted': 'text-emerald-700 bg-emerald-50 border-emerald-200',
        'Rejected': 'text-rose-700 bg-rose-50 border-rose-200/50',
        'Interviewed': 'text-slate-700 bg-slate-50 border-slate-200/50'
    };

    const dotColors: Record<string, string> = {
        'Hired': 'bg-emerald-500',
        'Hired (Signed)': 'bg-emerald-600',
        'Offered': 'bg-indigo-500',
        'Scheduled': 'bg-blue-500',
        'New': 'bg-amber-500',
        'Shortlisted': 'bg-emerald-500',
        'Rejected': 'bg-rose-500',
        'Interviewed': 'bg-slate-500',
    };

    return (
        <span className={`h-6 px-3 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all duration-300 hover:shadow-sm ${styles[effectiveStatus] || 'text-gray-500 bg-gray-50 border-gray-200'}`}>
            <div className={`size-1.5 rounded-full ${dotColors[effectiveStatus] || 'bg-gray-400'} animate-pulse`} />
            {effectiveStatus}{status === 'New' && effectiveStatus === 'Rejected' && <span className="text-[8px] opacity-70 ml-1">(NEW)</span>}
        </span>
    );
}
