import { useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Panel,
  Connection,
} from '@xyflow/react';
import { ErasableNode } from './ErasbleNode';
import { ErasableEdge } from './ErasbleEdge';
import { Eraser } from './Eraser';
import "./xy-theme.css";
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'erasable-node',
    position: { x: 0, y: 0 },
    data: { label: 'Hello' },
  },
  {
    id: '2',
    type: 'erasable-node',
    position: { x: 300, y: 0 },
    data: { label: 'World' },
  },
];

const initialEdges = [
  {
    id: '1->2',
    type: 'erasable-edge',
    source: '1',
    target: '2',
  },
];

const nodeTypes = {
  'erasable-node': ErasableNode,
};

const edgeTypes = {
  'erasable-edge': ErasableEdge,
};

const defaultEdgeOptions = {
  type: 'erasable-edge',
};
const FlowBuilder=()=> {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (params:Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const [isEraserActive, setIsEraserActive] = useState(false);

  return (
    <div className="w-full h-[500px]" style={{ minHeight: '600px' }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        defaultEdgeOptions={defaultEdgeOptions}
        selectionOnDrag={!isEraserActive}
        panOnDrag={false}
        panActivationKeyCode="Space"
        zoomOnScroll={false}
        zoomActivationKeyCode="Control"
        elementsSelectable={!isEraserActive}
        nodesDraggable={!isEraserActive}
      >
        <Background />
        <Controls />
        {isEraserActive && <Eraser />}

        <Panel position="top-left">
          <div className="xy-theme__button-group">
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
      </ReactFlow>
    </div>
  );
}

export default FlowBuilder;