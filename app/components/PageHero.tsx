'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    Icon: LucideIcon;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, Icon }) => {
    return (
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-dark text-white">
            {/* Intentional Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/40 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                >
                    <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 mb-10 shadow-2xl">
                        <Icon className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="font-syne font-black text-5xl md:text-8xl mb-8 tracking-tighter leading-none text-white uppercase opacity-90">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="font-geist text-xl md:text-2xl text-white/60 max-w-3xl leading-relaxed tracking-tight">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Gradient Overlay for bottom blending */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
};

export default PageHero;
