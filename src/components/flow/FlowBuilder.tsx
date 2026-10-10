"use client";

import { useCallback, useMemo } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

// Free-form drawing canvas (Excalidraw) - the stored `data` is just
// Excalidraw's own scene JSON (elements + a safe subset of appState), not a
// custom format. The backend treats `data` as opaque JSON either way, so
// swapping what's inside this file is the only change this needed.
function parseScene(data?: string): ExcalidrawInitialDataState {
  if (!data) return { elements: [], appState: {} };
  try {
    const parsed = JSON.parse(data);
    return {
      elements: Array.isArray(parsed.elements) ? parsed.elements : [],
      appState: parsed.appState ?? {},
    };
  } catch {
    return { elements: [], appState: {} };
  }
}

interface FlowBuilderProps {
  initialData?: string;
  onChange?: (data: string) => void;
  readOnly?: boolean;
}

const FlowBuilder = ({ initialData, onChange, readOnly }: FlowBuilderProps) => {
  const initial = useMemo(() => parseScene(initialData), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Excalidraw fires onChange on every pointer move while drawing - the
  // caller (the flowchart editor page) already debounces the actual save,
  // so this just forwards the serialized scene on every change.
  const handleChange = useCallback<NonNullable<Parameters<typeof Excalidraw>[0]["onChange"]>>(
    (elements, appState) => {
      if (!onChange) return;
      onChange(
        JSON.stringify({
          elements,
          appState: { viewBackgroundColor: appState.viewBackgroundColor },
        }),
      );
    },
    [onChange],
  );

  return (
    <div className="h-full w-full">
      <Excalidraw
        initialData={initial}
        onChange={readOnly ? undefined : handleChange}
        viewModeEnabled={readOnly}
      />
    </div>
  );
};

export default FlowBuilder;
