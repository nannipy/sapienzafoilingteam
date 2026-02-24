'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import PageHero from './PageHero';

interface PageLayoutProps {
    title?: string;
    subtitle?: string;
    Icon?: LucideIcon;
    customHero?: React.ReactNode;
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    title,
    subtitle,
    Icon,
    customHero,
    children,
}) => {
    return (
        <main className="min-h-screen bg-brand-dark">
            {/* Hero Section */}
            {customHero ? (
                customHero
            ) : title && Icon ? (
                <PageHero title={title} subtitle={subtitle} Icon={Icon} />
            ) : null}

            {/* Main Content Container */}
            <div className="relative -mt-20 z-10 mx-4">
                <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px] pb-10">
                    {children}
                </div>
            </div>

            {/* Footer Spacer */}
            <div className="h-24" />
        </main>
    );
};

export default PageLayout;
