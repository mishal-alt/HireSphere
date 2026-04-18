'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center overflow-hidden relative">
            {/* Background Faded Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                <img src="/favicon.png" className="w-[80vw] max-w-4xl grayscale" alt="" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
            >
                <div className="size-24 bg-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl border border-gray-100 p-4">
                    <img src="/favicon.png" className="size-full object-cover" alt="HireSphere" />
                </div>

                <h1 className="text-8xl font-black text-primary tracking-tighter mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lost in the pipeline?</h2>
                <p className="text-gray-500 max-w-xs mx-auto mb-10 leading-relaxed">
                    The page you're searching for has been moved or archived. Let's get you back to the talent search.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/">
                        <button className="h-12 px-8 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                            <Home className="size-4" />
                            Return Home
                        </button>
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="h-12 px-8 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft className="size-4" />
                        Go Back
                    </button>
                </div>
            </motion.div>
            
            <footer className="absolute bottom-8 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                HireSphere Corporate Infrastructure
            </footer>
        </div>
    );
}
