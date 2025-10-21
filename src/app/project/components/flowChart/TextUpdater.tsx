import React, { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

interface TextUpdaterNodeProps {
  data: {
    value: string;
    id: string;
    onChange: (id: string, value: string) => void;
  };
}

export const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      data.onChange(data.id, newValue); // ✅ Notify parent to update node value
    },
    [data]
  );

  return (
    <div className="text-updater-node p-3 border border-gray-300 rounded-md shadow-sm bg-white w-fit">
      <Handle type="target" position={Position.Top} />
      <div>
        <label
          htmlFor={`text-${data.id}`}
          className="text-sm font-medium text-gray-700 mr-2"
        >
          Text:
        </label>
        <input
          id={`text-${data.id}`}
          name="text"
          type="text"
          value={data.value || ""}
          onChange={handleChange}
          className="nodrag border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
