"use client";

import React, { useState, useCallback, useRef, DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Connection,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  ReactFlowInstance,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./flowChart/xyflow-theme.css";

import { TextUpdaterNode } from "./flowChart/TextUpdater";
import { NodePalette } from "./flowChart/NodePalette";
import { Eraser } from "./flowChart/eraser/Eraser";
import { ErasableEdge } from "./flowChart/eraser/ErasableEdge";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "textUpdater",
    position: { x: 100, y: 100 },
    data: { id: "1", value: "Editable Node" },
  },
  {
    id: "2",
    type:"default",
    position: { x: 400, y: 200 },
    data: { id: "2", value: "Static Node" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", label: "connects to", type: "erasable-edge" },
];

const nodeTypes = { textUpdater: TextUpdaterNode };
const edgeTypes = { 'erasable-edge': ErasableEdge } as const;

const FlowBuilder: React.FC = () => {
  const [isLassoActive, setIsLassoActive] = useState(true);
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [partial, setPartial] = useState(false);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeId = useRef(3); 

  const handleNodeValueChange = useCallback((id: string, newValue: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, value: newValue } } : node
      )
    );
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: 'erasable-edge' }, eds)),
    []
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${nodeId.current++}`,
        type,
        position,
        data: {
          id: `node-${nodeId.current - 1}`,
          value: type === "textUpdater" ? "New Node" : "Default Node",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: handleNodeValueChange,
    },
  }));

  return (
    <div className="flex gap-4 h-[700px] w-full">
      <div ref={reactFlowWrapper} className="flex-1 rounded-lg border overflow-hidden bg-white">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          selectionOnDrag={isLassoActive && !isEraserActive}
          panOnScroll
          fitView
          defaultEdgeOptions={{ type: 'erasable-edge' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <MiniMap pannable zoomable />
          <Controls />
          {isEraserActive && <Eraser />}
          <Panel position="top-left" className="lasso-controls" >
            <div className="xy-theme__button-group">
                <button
                    className={`xy-theme__button ${isLassoActive && !isEraserActive ? 'active' : ''}`}
                    onClick={() => { setIsLassoActive(true); setIsEraserActive(false); }}
                >
                    Lasso Mode
                </button>
                <button
                    className={`xy-theme__button_Selection  ${!isLassoActive && !isEraserActive ? 'active' : ''}`}
                    onClick={() => { setIsLassoActive(false); setIsEraserActive(false); }}
                >
                    Selection Mode
                </button>
                <button
                    className={`xy-theme__button ${isEraserActive ? 'active' : ''}`}
                    onClick={() => { setIsEraserActive((v) => !v); if (!isEraserActive) setIsLassoActive(false); }}
                >
                    Eraser Mode
                </button>
                </div>
                <label>
                <input
                    type="checkbox"
                    checked={partial}
                    onChange={() => setPartial((p) => !p)}
                    className="xy-theme__checkbox"
                />
                Partial selection
                </label>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowBuilder;
