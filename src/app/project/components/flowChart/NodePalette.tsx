"use client";

import React, { useState, DragEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NodePaletteProps {
  onDragStart: (event: DragEvent, nodeType: string) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`relative h-full max-h-full overflow-auto border rounded-lg bg-white shadow-sm transition-all duration-300 ${
        isExpanded ? "w-64 p-4" : "w-12 p-2"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-4 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors shadow-md z-10"
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {isExpanded ? (
        <>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Node Types</h3>
          <div className="space-y-3">
            <div
              className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50 cursor-move hover:bg-blue-100 transition-colors text-center"
              onDragStart={(event) => onDragStart(event, "textUpdater")}
              draggable
            >
              <div className="font-medium text-blue-700">Text Updater</div>
              <div className="text-xs text-gray-600 mt-1">Editable text node</div>
            </div>

            <div
              className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-move hover:bg-gray-100 transition-colors text-center"
              onDragStart={(event) => onDragStart(event, "default")}
              draggable
            >
              <div className="font-medium text-gray-700">Default Node</div>
              <div className="text-xs text-gray-600 mt-1">Standard node</div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> Drag and drop nodes onto the canvas to add them to your flow.
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-8">
          <div className="writing-mode-vertical text-xs font-medium text-gray-500 rotate-180">
            Nodes
          </div>
        </div>
      )}
    </aside>
  );
};
