import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';

import NodesPanel from './components/NodesPanel';
import SettingsPanel from './components/SettingsPanel';
import TextNode from './components/TextNode';

// Initial nodes to start with
const initialNodes = [
  {
    id: '1',
    type: 'textNode',
    data: { label: 'Send Message', text: 'test message 1' },
    position: { x: 250, y: 5 },
  },
];

// Define custom node types
const nodeTypes = { textNode: TextNode };

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });


  // Effect to hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle node click to show SettingsPanel
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click to deselect node and show NodesPanel
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);


  // Callback for handling new connections
  const onConnect = useCallback(
    (params) => {
      // Logic to ensure a source handle can only have one outgoing edge
      const sourceHandleHasEdge = edges.some(edge => edge.source === params.source);
      if (!sourceHandleHasEdge) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        console.warn("Source handle already has an edge.");
      }
    },
    [edges, setEdges]
  );

  // Drag and drop handling to add new nodes
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: nanoid(),
        type,
        position,
        data: { label: `Send Message`, text: `textNode` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Save flow validation logic
  const onSave = () => {
    if (nodes.length <= 1) {
      setNotification({ show: true, message: 'Flow saved successfully!', type: 'success' });
      return;
    }
  
    // Find all nodes that are targets of an edge
    const targetNodeIds = new Set(edges.map(edge => edge.target));
  
    // Filter for nodes that are NOT targets (i.e., have empty target handles)
    const nodesWithEmptyTargetHandles = nodes.filter(node => !targetNodeIds.has(node.id));
  
    if (nodesWithEmptyTargetHandles.length > 1) {
      setNotification({ show: true, message: 'Cannot save Flow: More than one node has an empty target handle.', type: 'error' });
    } else {
      setNotification({ show: true, message: 'Flow saved successfully!', type: 'success' });
    }
  };
  

  return (
    <div className="app-container">
      <header className="header">
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <button onClick={onSave} className="save-button">
          Save Changes
        </button>
      </header>
      <div className='content-container'>
        <ReactFlowProvider>
          <div className="react-flow-container" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
        {/* Conditional rendering of panels */}
        {selectedNode ? (
          <SettingsPanel selectedNode={selectedNode} setNodes={setNodes} setSelectedNode={setSelectedNode} />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  );
};

export default App;