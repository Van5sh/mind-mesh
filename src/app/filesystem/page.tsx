"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Folder, Star, Timer, UploadCloud } from "lucide-react";

const HomePage = () => {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">Filesystem Home Page</h1>
          <p className="text-gray-600">
            Welcome to the Filesystem Home Page. Use the sidebar to navigate through your files and settings.
          </p>
        </div>

        <div className="flex justify-center items-center border-2 border-gray-300 rounded-lg p-3 my-6 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-col justify-center items-center gap-4 border-2 border-dashed border-gray-400 rounded-lg p-10 w-full">
            <UploadCloud size={48} className="text-gray-600" />
            <p className="text-center text-stone-600 text-2xl font-bold">
              Drag and drop your file here to upload
              <span className="block text-sm text-gray-500 mt-2">or click to browse</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full mt-10">
          <div className="flex flex-row items-center justify-between w-full gap-6">
            <Select onValueChange={(value) => setSelected(value)}>
              <SelectTrigger className="w-[240px] h-12 bg-white border border-gray-300 text-gray-800 font-medium rounded-xl shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 transition">
                <SelectValue placeholder="Select Folder" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl p-1">
                <SelectItem
                  value="Recents"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <Timer size={18} className="text-gray-600" />
                  <span>Recents</span>
                </SelectItem>
                <SelectItem
                  value="Folders"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <Folder size={18} className="text-gray-600" />
                  <span>Folders</span>
                </SelectItem>
                <SelectItem
                  value="Favourites"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <Star size={18} className="text-gray-600" />
                  <span>Favourites</span>
                </SelectItem>
              </SelectContent>
            </Select>
            {selected && (
              <div className="border-2 rounded-3xl p-2">
                <h2 className="text-md text-white">Viewing {selected}</h2>
              </div>
            )}
          </div>

          <Separator className="w-full mt-6" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
