"use client";

import React, { useState } from "react";
import { CircleX, File, FolderOpenDot, Home, Settings, UserCog } from "lucide-react";
import colors from "@/contants/colors";
import { useRouter } from "next/navigation";

const items = [
{
    icon: <Home size={32}/>,
    name: "Home",
    link: "/landingpage",
},
{
    icon: <FolderOpenDot size={32} />,
    name: "Projects",
    link: "/project",
},
{
    icon: <FolderOpenDot size={32} />,
    name: "File System",
    link: "/filesystem",
},
{
    icon: <Settings size={32}/>,
    name: "Settings",
    link: "/settings",
},
{
    icon: <File size={32}/>,
    name: "Reports",
    link: "/docs",
}
];

const Navbar = () => {
const [onPress, setOnPress] = useState(false);
const radius = 100;
const router = useRouter();
return (
    <div>
    {onPress &&
    <div
        className="fixed inset-0 flex text-white justify-center items-center bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => setOnPress(false)}
        >
        <svg width="500" height="500" viewBox="0 0 500 500">
            <circle
                cx="250"
                cy="250"
                r="200"
                fill={colors.mindmesh.background}
            />
            <circle
            cx="250"
            cy="250"
            r="100"
            fill={colors.mindmesh.hover}
            />
        </svg>
        {items.map((item, idx) => {
        const angle = (idx /items.length)*Math.PI*2 - Math.PI/2;
        const x = radius*1.5 * Math.cos(angle);
        const y = radius*1.5 * Math.sin(angle);  
        return(
        <div
            key={idx}
            className="absolute flex flex-col justify-center items-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
            style={{
                transform: `translate(${x}px, ${y}px)`,
                }}
            title={item.name}
            onClick={(e) => {
                e.stopPropagation();
                setOnPress(false);
                window.location.href = item.link;
                router.push(item.link);
            }
            }
        >
            {item.icon}
            {item.name}
        </div>);
        })}
        </div>
        }
        <div
        className="flex justify-center items-center rounded-full p-3 fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-2xl"
        onClick={() => setOnPress((prev) => !prev)}
        style={{
        backgroundColor: colors.mindmesh.hover,
        border: `1px solid ${colors.mindmesh.border}`,
        boxShadow: `0 4px 12px ${colors.mindmesh.shadow}`,
        }}
    >
        {onPress ? (
        <CircleX
            size={28}
            style={{
            color: colors.mindmesh.error,
            transition: "all 0.3s ease",
            }}
            className="group-hover:scale-110 group-hover:rotate-12"
        /> 
        ):(
            <UserCog
            size={28}
            style={{
            color: colors.mindmesh.info,
            transition: "all 0.3s ease",
            }}
            className="group-hover:scale-110 group-hover:rotate-12"
        />
        )}
    </div>
    </div>
);
};

export default Navbar;
