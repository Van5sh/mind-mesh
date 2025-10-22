import { Download, Edit, FileIcon, Trash2 } from "lucide-react";
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
}

const Filebar = ({
    file_name,
    file_size,
    download,
    delete: deleteFn,
    rename
}: FilebarProps) => {
    return (
        <div
            className="flex flex-row justify-between items-center p-2 rounded-lg shadow-md w-[90vw] mx-auto "
            style={{
                backgroundColor: colors.mindmesh.border,
            }}
        >
            <div
                className={`flex flex-row justify-between items-center bg-white gap-4 p-4 rounded-lg shadow-md w-[90vw] mx-auto`}
            >
                <div className="flex flex-row items-center gap-4">
                    <div className="rounded-xl bg-[#0f192b] p-3">
                        <FileIcon size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-zinc-900">{file_name}</h1>
                        <h6 style={{ color: colors.mindmesh.text.muted }}>{file_size}</h6>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <Button className="hover:cursor-pointer" style={{background:colors.mindmesh.success}} onClick={download}>
                        <Download />
                    </Button>
                    <Button className="hover:cursor-pointer" style={{background:colors.mindmesh.error}} onClick={deleteFn}>
                        <Trash2 />
                    </Button>
                    <Button className="hover:cursor-pointer" style={{background:colors.mindmesh.warning}} onClick={rename}>
                        <Edit />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Filebar;