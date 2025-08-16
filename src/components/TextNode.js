import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// This is a custom node component that will be rendered for nodes of type 'textNode'.
// It's wrapped in memo to prevent unnecessary re-renders.
export default memo(({ data, isConnectable }) => {
  return (
    <div className="text-node">
      {/* Target handle: a connection point for incoming edges. Appears on the left. */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      
      {/* Node Header displaying the node's label (e.g., "Send Message") */}
      <div className="node-header">
        {data.label}
      </div>

      {/* Node Content displaying the text message */}
      <div className="node-content">
        {data.text || 'test message'}
      </div>

      {/* Source handle: a connection point for outgoing edges. Appears on the right. */}
      <Handle
        type="source"
        position={Position.Right}
        id="a" // An id is required for handles
        isConnectable={isConnectable}
      />
    </div>
  );
});