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
        <div className="bg-[#0f192b] text-white">
            <div className="left-0 m-5 fixed z-50">
                <Sidebar open={open} setOpen={setOpen} />
            </div>
            <div className="flex-1 justify-center w-full">
                {children}
            </div>
        </div>
    );
}
