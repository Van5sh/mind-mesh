"use client";

import { Files, Home, Search, Settings, SidebarClose, SidebarOpen, Trash2Icon } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    return (
        <>
            {open && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setOpen?.(false)}
                />
            )}
            
            <div className={`fixed left-0 top-0 h-screen ${open ? 'w-64' : 'w-12 '} flex flex-col items-start transition-all duration-300 overflow-hidden z-50`}>
                {open ? (
                    <div className="w-full bg-[#112240] p-4 h-full flex flex-col">
                        <button
                            type="button"
                            aria-label="Close sidebar"
                            className="text-white mb-4 hover:opacity-80 hover:cursor-pointer"
                            onClick={() => setOpen?.(false)}
                        >
                            <SidebarClose size={30}  />
                        </button>
                        <h1 className="text-white font-bold text-lg mb-4">FILES</h1>
                        <div className="w-full">
                            <ul className="text-white space-y-2 w-full">
                                <li onClick={() => setOpen?.(false)}>
                                    <Link href="/filesystem" className="flex items-center gap-3 hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                        <Home size={20} />
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li onClick={() => setOpen?.(false)}>
                                    <button className="flex items-center gap-3 w-full hover:bg-[#1d3557] p-2 rounded text-white/90 cursor-pointer">
                                        <Search size={20} />
                                        <span>Search</span>
                                    </button>
                                </li>
                                <li onClick={() => setOpen?.(false)}>
                                    <Link href="/filesystem/files" className="flex items-center gap-3 hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                        <Files size={20} />
                                        <span>Files</span>
                                    </Link>
                                </li>
                                <li onClick={() => setOpen?.(false)}>
                                    <Link href="/filesystem/trash" className="flex items-center gap-3 hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                        <Trash2Icon size={20} />
                                        <span>Trash</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-center">
                        <button
                            type="button"
                            aria-label="Open sidebar"
                            className="text-white top-5 hover:opacity-80 hover:cursor-pointer"
                            onClick={() => setOpen?.(true)}
                        >
                            <SidebarOpen size={30} className="top-4"/>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;