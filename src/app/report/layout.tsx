import React from 'react';
import Sections from '@/components/component/Sections';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const SectionData = [
        {
            title: "Customization",
            description:"Easily customize report formats and content to suit your specific requirements.",
        },
        {
            title: "AI",
            description:"Leverage artificial intelligence to generate comprehensive reports tailored to your needs.",
        },
    ]
    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex justify-center items-center flex-col p-1">
                <h1>MIND MESH REPORT PAGE</h1>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default Layout;