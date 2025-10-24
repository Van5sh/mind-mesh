"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Folder, Star, Timer, UploadCloud } from "lucide-react";

const HomePage = () => {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Filesystem Home Page
          </h1>
          <p className="text-gray-400 text-lg">
            Welcome to the Filesystem Home Page. Use the sidebar to navigate through your files and settings.
          </p>
        </div>
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-300"></div>
          <div className="relative flex justify-center items-center border-2 border-gray-700 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-3 cursor-pointer hover:border-gray-600 transition-all duration-300">
            <div className="flex flex-col justify-center items-center gap-3 border-2 border-dashed border-gray-600 rounded-xl p-10 w-full hover:border-gray-500 transition-colors">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                <UploadCloud size={36} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-white text-xl font-semibold mb-1">
                  Drag & drop your file here
                </p>
                <p className="text-gray-400 text-sm">
                  or click to browse from your device
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mt-8">
          <div className="flex flex-row items-center justify-between w-full gap-4 mb-5">
            <Select onValueChange={(value) => setSelected(value)}>
              <SelectTrigger className="w-[240px] h-12 bg-slate-800/70 backdrop-blur-sm border-2 border-gray-700 text-white font-medium rounded-xl shadow-lg hover:border-gray-600 hover:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                <SelectValue placeholder="Select Folder" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-2 border-gray-700 shadow-2xl rounded-xl p-2">
                <SelectItem
                  value="Recents"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors text-white"
                >
                  <Timer size={18} className="text-blue-400" />
                  <span>Recents</span>
                </SelectItem>
                <SelectItem
                  value="Folders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors text-white"
                >
                  <Folder size={18} className="text-purple-400" />
                  <span>Folders</span>
                </SelectItem>
                <SelectItem
                  value="Favourites"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors text-white"
                >
                  <Star size={18} className="text-yellow-400" />
                  <span>Favourites</span>
                </SelectItem>
              </SelectContent>
            </Select>

            {selected && (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-2 border-gray-700 rounded-xl px-4 py-2 backdrop-blur-sm">
                <h2 className="text-base text-white font-medium">
                  Viewing{" "}
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    {selected}
                  </span>
                </h2>
              </div>
            )}
          </div>

          <Separator className="w-full bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
