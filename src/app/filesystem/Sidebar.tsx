"use client";

import { SidebarClose, SidebarOpen } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    return (
        <>
            {/* Backdrop overlay when sidebar is open */}
            {open && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setOpen?.(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-screen bg-[#112240] ${open ? 'w-64 p-4' : 'w-12 p-2'} flex flex-col items-start transition-all duration-300 overflow-hidden z-50`}>
            {open ? (
                <div className="w-full">
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        className="text-white mb-4 hover:opacity-80"
                        onClick={() => setOpen?.(false)}
                    >
                        <SidebarClose />
                    </button>
                    <h1 className="text-white font-bold text-lg mb-4">FILES</h1>
                    <div className="w-full">
                        <ul className="text-white space-y-2 w-full">
                            <li onClick={()=>{setOpen?.(false)}}>
                                <Link href="/filesystem" className="block hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                    Home
                                </Link>
                            </li>
                            <li onClick={()=>{setOpen?.(false)}} className="p-2 rounded text-white/90">
                                Search
                            </li>
                            <li onClick={()=>{setOpen?.(false)}}>
                                <Link href="/filesystem/files" className="block hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                    Files
                                </Link>
                            </li>
                            <li onClick={()=>{setOpen?.(false)}} className="p-2 rounded text-white/90">
                                Settings
                            </li>
                            <li onClick={()=>{setOpen?.(false)}}  className="p-2 rounded text-white/90">
                                Trash
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-center">
                    <button
                        type="button"
                        aria-label="Open sidebar"
                        className="text-white hover:opacity-80"
                        onClick={() => setOpen?.(true)}
                    >
                        <SidebarOpen />
                    </button>
                </div>
            )}
            </div>
        </>
    );
};

export default Sidebar;