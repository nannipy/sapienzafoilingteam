'use client';

import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
}) => {
    return (
        <main className="min-h-screen bg-brand-dark pt-32">
            {/* Main Content Container */}
            <div className="relative z-10 mx-4">
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
