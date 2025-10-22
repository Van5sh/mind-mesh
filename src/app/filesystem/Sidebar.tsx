import { SidebarClose, SidebarOpen } from "lucide-react";
import { useRouter } from "next/navigation";
interface SidebarProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const router = useRouter();
    return (
        <div className={`${open ? 'w-64 bg-[#112240]' : 'w-0'} h-screen  p-4 flex flex-col items-center transition-all duration-300`}>
            {open ? (
                <div className="w-full">
                    <SidebarClose 
                        className="hover:cursor-pointer text-white mb-4" 
                        onClick={() => setOpen?.(false)}
                    />
                    <h1 className="text-white font-bold text-lg mb-4">FILES</h1>
                    <div>
                        <ul className="text-white space-y-2">
                            <li className="hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                <a href="/filesystem">
                                    Home
                                </a>
                            </li>
                            <li className="hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                Search
                            </li>
                            <li  className="hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                <a href="/filesystem/files">
                                    Files
                                </a>
                            </li>
                            <li className="hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                Settings
                            </li>
                            <li className="hover:bg-[#1d3557] p-2 rounded cursor-pointer">
                                Trash
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div>
                    <SidebarOpen 
                        className="hover:cursor-pointer text-white ml-2" 
                        onClick={() => setOpen?.(true)}
                    />
                </div>
            )}
        </div>
    );
};

export default Sidebar;