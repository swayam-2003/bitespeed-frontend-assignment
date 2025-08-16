import React from 'react';

const SettingsPanel = ({ selectedNode, setNodes, setSelectedNode }) => {
  // Handler to update the node's text when the textarea value changes.
  const handleTextChange = (event) => {
    const newText = event.target.value;
    // Update the nodes state. We find the selected node by its id
    // and create a new node object with the updated text.
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          // It's important to create a new object here to trigger a re-render.
          node.data = {
            ...node.data,
            text: newText,
          };
        }
        return node;
      })
    );
    // Also update the selectedNode state to reflect the change immediately in the panel.
    setSelectedNode((node) => ({ ...node, data: { ...node.data, text: newText } }));
  };

  return (
    <aside className="panel settings-panel">
      {/* Back button to deselect the node and return to the Nodes Panel */}
      <div className="back-button" onClick={() => setSelectedNode(null)}>
        <span>←</span> Message
      </div>
      <hr />
      {/* Input field for editing the node's text */}
      <label>Text</label>
      <textarea
        rows="4"
        value={selectedNode.data.text}
        onChange={handleTextChange}
      />
    </aside>
  );
};

export default SettingsPanel;