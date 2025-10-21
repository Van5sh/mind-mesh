import React from 'react';
import Sections from '@/components/component/Sections';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const SectionData = [
        {
            title: "AI",
            description:"Leverage artificial intelligence to generate comprehensive reports tailored to your needs.",
        },
        {
            title: "FlowCharts",
            description:"Easily customize report formats and content to suit your specific requirements.",
        },
        {
            title: "Project Analysis",
            description:"Get in-depth analysis of your projects with our advanced reporting tools.",
        },
    ]
    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex justify-center items-center flex-col p-1">
                <Sections sections={SectionData}/>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default Layout;