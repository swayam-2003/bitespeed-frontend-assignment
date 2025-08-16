import React from 'react';

const NodesPanel = () => {
  // onDragStart is a native HTML5 drag event handler.
  // It sets the data to be transferred during the drag operation.
  const onDragStart = (event, nodeType) => {
    // We store the node type in the dataTransfer object.
    // This will be used in the main App component's onDrop handler
    // to create a new node of the correct type.
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="panel nodes-panel">
      <h3>Nodes</h3>
      {/* 
        This is a draggable node item. When dragged, it triggers onDragStart.
        The 'draggable' attribute makes the element draggable.
      */}
      <div
        className="node-item"
        onDragStart={(event) => onDragStart(event, 'textNode')}
        draggable
      >
        <span>Message</span>
      </div>
      {/* To add more node types, simply add another draggable div like the one above. */}
    </aside>
  );
};

export default NodesPanel;