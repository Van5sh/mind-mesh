import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Panel,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import { ErasableNode } from './ErasbleNode';
import { ErasableEdge } from './ErasbleEdge';
import { Eraser } from './Eraser';
import "./xy-theme.css";
import '@xyflow/react/dist/style.css';

const fallbackNodes: Node[] = [
  { id: '1', type: 'erasable-node', position: { x: 0, y: 0 }, data: { label: 'Hello' } },
  { id: '2', type: 'erasable-node', position: { x: 300, y: 0 }, data: { label: 'World' } },
];

const fallbackEdges: Edge[] = [
  { id: '1->2', type: 'erasable-edge', source: '1', target: '2' },
];

function parseGraph(data?: string): { nodes: Node[]; edges: Edge[] } {
  if (!data) return { nodes: fallbackNodes, edges: fallbackEdges };
  try {
    const parsed = JSON.parse(data);
    const nodes: Node[] = Array.isArray(parsed.nodes)
      ? parsed.nodes.map((n: Node) => ({ ...n, type: n.type ?? 'erasable-node' }))
      : fallbackNodes;
    const edges: Edge[] = Array.isArray(parsed.edges)
      ? parsed.edges.map((e: Edge) => ({ ...e, type: e.type ?? 'erasable-edge' }))
      : fallbackEdges;
    return { nodes, edges };
  } catch {
    return { nodes: fallbackNodes, edges: fallbackEdges };
  }
}

const nodeTypes = {
  'erasable-node': ErasableNode,
};

const edgeTypes = {
  'erasable-edge': ErasableEdge,
};

const defaultEdgeOptions = {
  type: 'erasable-edge',
};

interface FlowBuilderProps {
  initialData?: string;
  onChange?: (data: string) => void;
  readOnly?: boolean;
}

const FlowBuilder = ({ initialData, onChange, readOnly }: FlowBuilderProps) => {
  const initial = useMemo(() => parseGraph(initialData), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const idRef = useRef(nodes.length + 1);

  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges],
  );

  const [isEraserActive, setIsEraserActive] = useState(false);

  useEffect(() => {
    if (!onChange) return;
    const handle = window.setTimeout(() => {
      onChange(JSON.stringify({ nodes, edges }));
    }, 400);
    return () => window.clearTimeout(handle);
  }, [nodes, edges, onChange]);

  const addNode = useCallback(() => {
    const id = String(idRef.current++);
    setNodes((ns) => [
      ...ns,
      {
        id,
        type: 'erasable-node',
        position: { x: 80 + Math.random() * 240, y: 80 + Math.random() * 240 },
        data: { label: 'New step' },
      },
    ]);
  }, [setNodes]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        fitView
        defaultEdgeOptions={defaultEdgeOptions}
        selectionOnDrag={!isEraserActive && !readOnly}
        panOnDrag={!readOnly ? false : true}
        panActivationKeyCode="Space"
        zoomOnScroll={false}
        zoomActivationKeyCode="Control"
        elementsSelectable={!isEraserActive && !readOnly}
        nodesDraggable={!isEraserActive && !readOnly}
        nodesConnectable={!readOnly}
      >
        <Background />
        <Controls />
        {isEraserActive && !readOnly && <Eraser />}

        {!readOnly && (
          <Panel position="top-left">
            <div className="xy-theme__button-group">
              <button className="xy-theme__button" onClick={addNode}>
                + Add node
              </button>
              <button
                className={`xy-theme__button ${isEraserActive ? 'active' : ''}`}
                onClick={() => {
                  setIsEraserActive(true);
                  setNodes((ns) => ns.map((n) => ({ ...n, selected: false })));
                  setEdges((es) => es.map((e) => ({ ...e, selected: false })));
                }}
              >
                Eraser Mode
              </button>
              <button
                className={`xy-theme__button ${!isEraserActive ? 'active' : ''}`}
                onClick={() => {
                  setIsEraserActive(false);
                  setNodes((ns) => ns.map((n) => ({ ...n, data: { ...n.data, toBeDeleted: false } })));
                }}
              >
                Selection Mode
              </button>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default FlowBuilder;
