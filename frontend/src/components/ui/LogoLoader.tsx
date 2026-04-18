'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoLoaderProps {
    size?: "small" | "medium" | "large";
    className?: string;
}

export default function LogoLoader({ size = "medium", className = "" }: LogoLoaderProps) {
    const dimensions = {
        small: "size-8",
        medium: "size-16",
        large: "size-24"
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`${dimensions[size]} bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-md`}
            >
                <img src="/favicon.png" className="size-full object-cover" alt="Loading..." />
            </motion.div>
        </div>
    );
}
