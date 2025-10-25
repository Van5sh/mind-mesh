import { Download, Edit, FileIcon, Star, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import colors from "@/contants/colors";

interface FilebarProps {
    file_name: string;
    file_size: string;
    file_type: string;
    last_modified: string;
    download: () => void;
    delete: () => void;
    rename: () => void;
    addToFavorites: () => void;
}

const Filebar = ({
    file_name,
    file_size,
    last_modified,
    download,
    delete: deleteFn,
    rename,
    addToFavorites
}: FilebarProps) => {
    return (
        <div
            className="group relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-6xl mx-auto overflow-hidden"
            style={{
                backgroundColor: colors.mindmesh.border,
            }}
        >
            <div className="flex flex-row justify-between items-center bg-white p-5 m-0.5 rounded-xl transition-transform duration-300 hover:scale-[1.01]">
                <div className="flex flex-row items-center gap-5 flex-1 min-w-0">
                    <div className="rounded-xl bg-gradient-to-br from-[#0f192b] to-[#1a2942] p-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <FileIcon size={28} className="text-white" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <h1 className="font-bold text-lg text-zinc-900 truncate">{file_name}</h1>
                        <div className="flex flex-row gap-3 mt-1">
                            <span className="text-sm font-medium" style={{ color: colors.mindmesh.text.muted }}>
                                {file_size}
                            </span>
                            <span className="text-sm" style={{ color: colors.mindmesh.text.muted }}>
                                •
                            </span>
                            <span className="text-sm" style={{ color: colors.mindmesh.text.muted }}>
                                {new Date(last_modified).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 ml-4">
                    <Button 
                        className="hover:cursor-pointer hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg" 
                        style={{background: "#fbbf24"}} 
                        onClick={addToFavorites}
                        size="icon"
                    >
                        <Star size={18} />
                    </Button>
                    <Button 
                        className="hover:cursor-pointer hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg" 
                        style={{background: colors.mindmesh.success}} 
                        onClick={download}
                        size="icon"
                    >
                        <Download size={18} />
                    </Button>
                    <Button 
                        className="hover:cursor-pointer hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg" 
                        style={{background: colors.mindmesh.warning}} 
                        onClick={rename}
                        size="icon"
                    >
                        <Edit size={18} />
                    </Button>
                    <Button 
                        className="hover:cursor-pointer hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg" 
                        style={{background: colors.mindmesh.error}} 
                        onClick={deleteFn}
                        size="icon"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Filebar;