'use client';

import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    noBottomPadding?: boolean;
    noBackground?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    noBottomPadding = false,
    noBackground = false,
}) => {
    return (
        <main className="min-h-screen bg-brand-dark pt-32">
            {/* Main Content Container */}
            <div className="relative z-10 mx-4">
                <div className={`max-w-7xl mx-auto rounded-3xl shadow-xl overflow-hidden min-h-[600px] ${noBackground ? '' : 'bg-white border border-gray-100'} ${noBottomPadding ? 'pb-0' : 'pb-10'}`}>
                    {children}
                </div>
            </div>

            {/* Footer Spacer */}
            <div className="h-24" />
        </main>
    );
};

export default PageLayout;
