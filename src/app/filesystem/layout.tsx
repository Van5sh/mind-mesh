"use client"

import "../globals.css"
import React from "react";
import Sidebar from "./Sidebar";

export default function FilesystemLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [open,setOpen]=React.useState(false);
    return (
        <div className="min-h-screen bg-[#0f192b] text-white">
            <Sidebar open={open} setOpen={setOpen} />
            <div className="flex-1 justify-center w-full">
                {children}
            </div>
        </div>
    );
}
