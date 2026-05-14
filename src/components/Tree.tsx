import React from 'react';
import { ExplorerNode, NodeType } from '../types';
import { TreeNode } from './TreeNode';

interface TreeProps {
  nodes: ExplorerNode[];
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onCreateChild: (type: NodeType, name: string, parentId: string) => void;
}

export const Tree: React.FC<TreeProps> = ({
  nodes,
  onToggle,
  onRename,
  onDelete,
  onCreateChild,
}) => {
  if (nodes.length === 0) {
    return (
      <div className="tree__empty">
        <div className="tree__empty-icon">🗂️</div>
        <p className="tree__empty-title">No files yet</p>
        <p className="tree__empty-subtitle">
          Use the buttons above to create your first file or folder.
        </p>
      </div>
    );
  }

  return (
    <div className="tree" role="tree" aria-label="File explorer">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
          onCreateChild={onCreateChild}
        />
      ))}
    </div>
  );
};
