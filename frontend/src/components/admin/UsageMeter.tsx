'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface UsageMeterProps {
    label: string;
    current: number;
    limit: number;
    icon?: LucideIcon;
    variant?: 'compact' | 'full';
    className?: string;
}

export const UsageMeter = ({ label, current, limit, icon: Icon, variant = 'full', className = "" }: UsageMeterProps) => {
    const percentage = Math.min((current / limit) * 100, 100);
    const isWarning = percentage >= 80;

    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200/30">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full transition-all duration-1000 ${isWarning ? 'bg-amber-500' : 'bg-emerald-600'}`}
                    />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none whitespace-nowrap">
                    {current} / {limit} {label}
                </span>
            </div>
        );
    }

    return (
        <div className={`space-y-2.5 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="size-3.5 text-gray-400" />}
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{current} / {limit}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100/50 rounded-full overflow-hidden border border-gray-200/20">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full transition-all duration-1000 ${isWarning ? 'bg-amber-500' : 'bg-emerald-600'}`}
                />
            </div>
        </div>
    );
};
