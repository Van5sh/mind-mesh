"use client";
import colors from "@/contants/colors";
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
      <div 
        className="flex flex-row gap-1 p-2 rounded-xl shadow-lg"
        style={{
          backgroundColor: colors.mindmesh.surface,
          border: `1px solid ${colors.mindmesh.border}`
        }}
      >
        {sections.map((section, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="flex-1 relative group font-medium text-sm cursor-pointer transition-all duration-300 px-4 py-2.5 rounded-lg"
              style={{
                backgroundColor: isSelected 
                  ? colors.mindmesh.sky 
                  : 'transparent',
                color: isSelected 
                  ? colors.mindmesh.text.primary 
                  : colors.mindmesh.text.secondary,
                boxShadow: isSelected 
                  ? `0 4px 12px ${colors.mindmesh.shadow}` 
                  : 'none',
              }}
            >
              {section.title}

              {!isSelected && (
                <span 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 hidden group-hover:block text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap z-20 pointer-events-none"
                  style={{
                    backgroundColor: colors.mindmesh.surfaceAlt,
                    color: colors.mindmesh.text.primary,
                    border: `1px solid ${colors.mindmesh.border}`
                  }}
                >
                  {section.description}
                  <span 
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 transform rotate-45"
                    style={{
                      backgroundColor: colors.mindmesh.surfaceAlt,
                      borderLeft: `1px solid ${colors.mindmesh.border}`,
                      borderTop: `1px solid ${colors.mindmesh.border}`,
                    }}
                  />
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