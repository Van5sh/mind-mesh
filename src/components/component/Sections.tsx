"use client";
import React, { useState, useEffect } from "react";

interface SectionProps {
  title: string;
  description: string;
}

interface SectionsProps {
  sections: SectionProps[];
  onSelect?: (index: number) => void;
}

const Sections: React.FC<SectionsProps> = ({ sections, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedIndex);
    }
  }, [selectedIndex, onSelect]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-row gap-1 bg-gray-100 p-1.5 rounded-xl shadow-inner">
        {sections.map((section, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-1 relative group font-medium text-sm cursor-pointer transition-all duration-300 px-4 py-2.5 rounded-lg
                ${
                  isSelected
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              {section.title}

              {!isSelected && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-3 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap z-20 pointer-events-none">
                  {section.description}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sections;
