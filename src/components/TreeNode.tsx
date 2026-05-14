import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ExplorerNode, NodeType } from '../types';
import { Button } from './Button';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const FolderClosedIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path d="M2 5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
  </svg>
);

const FolderOpenIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H2V6zm0 3h16v5a2 2 0 01-2 2H4a2 2 0 01-2-2V9z"
      clipRule="evenodd"
    />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm5 1V3L15 9h-5a1 1 0 01-1-1V5z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const AddFileIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path
      fillRule="evenodd"
      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
      clipRule="evenodd"
    />
  </svg>
);

const AddFolderIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    <path
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      d="M10 9v4M8 11h4"
    />
  </svg>
);

// ─── Inline Name Input ────────────────────────────────────────────────────────

interface InlineInputProps {
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

const InlineInput: React.FC<InlineInputProps> = ({
  initialValue = '',
  onConfirm,
  onCancel,
  placeholder = 'Name…',
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commit = useCallback(() => {
    if (value.trim()) onConfirm(value.trim());
    else onCancel();
  }, [value, onConfirm, onCancel]);

  return (
    <input
      ref={inputRef}
      className="tree-node__inline-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') onCancel();
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

// ─── TreeNode ─────────────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: ExplorerNode;
  depth: number;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onCreateChild: (type: NodeType, name: string, parentId: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  onToggle,
  onRename,
  onDelete,
  onCreateChild,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [creatingChild, setCreatingChild] = useState<NodeType | null>(null);
  const [hovered, setHovered] = useState(false);

  const isFolder = node.type === 'folder';
  const indentPx = depth * 16;

  const handleRename = useCallback(
    (newName: string) => {
      onRename(node.id, newName);
      setIsEditing(false);
    },
    [node.id, onRename]
  );

  const handleCreateChild = useCallback(
    (name: string) => {
      if (creatingChild) {
        onCreateChild(creatingChild, name, node.id);
        setCreatingChild(null);
      }
    },
    [creatingChild, node.id, onCreateChild]
  );

  const startCreateChild = useCallback(
    (type: NodeType) => {
      // Expand folder if collapsed
      if (!node.isExpanded) onToggle(node.id);
      setCreatingChild(type);
    },
    [node.id, node.isExpanded, onToggle]
  );

  return (
    <div className="tree-node__wrapper">
      {/* Row */}
      <div
        className={`tree-node__row${hovered ? ' tree-node__row--hovered' : ''}`}
        style={{ paddingLeft: `${indentPx + 8}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => isFolder && onToggle(node.id)}
        role={isFolder ? 'button' : undefined}
        aria-expanded={isFolder ? node.isExpanded : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && isFolder)
            onToggle(node.id);
        }}
      >
        {/* Chevron for folders */}
        <span className="tree-node__chevron">
          {isFolder ? (
            node.isExpanded ? (
              <ChevronDown />
            ) : (
              <ChevronRight />
            )
          ) : null}
        </span>

        {/* File / Folder icon */}
        <span
          className={`tree-node__icon tree-node__icon--${node.type}${isFolder && node.isExpanded ? ' tree-node__icon--open' : ''}`}
        >
          {isFolder ? (
            node.isExpanded ? (
              <FolderOpenIcon />
            ) : (
              <FolderClosedIcon />
            )
          ) : (
            <FileIcon />
          )}
        </span>

        {/* Name or edit input */}
        {isEditing ? (
          <InlineInput
            initialValue={node.name}
            onConfirm={handleRename}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <span className="tree-node__name">{node.name}</span>
        )}

        {/* Action buttons (visible on hover) */}
        {!isEditing && (
          <span className={`tree-node__actions${hovered ? ' tree-node__actions--visible' : ''}`}>
            {isFolder && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<AddFileIcon />}
                  title="New File"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCreateChild('file');
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<AddFolderIcon />}
                  title="New Folder"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCreateChild('folder');
                  }}
                />
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={<PencilIcon />}
              title="Rename"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            />
            <Button
              variant="danger"
              size="sm"
              icon={<TrashIcon />}
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
            />
          </span>
        )}
      </div>

      {/* Children (recursive) */}
      {isFolder && node.isExpanded && (
        <div className="tree-node__children">
          {/* Inline creator for a new child */}
          {creatingChild !== null && (
            <div
              className="tree-node__row tree-node__row--creating"
              style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
            >
              <span className="tree-node__icon">
                {creatingChild === 'folder' ? <FolderClosedIcon /> : <FileIcon />}
              </span>
              <InlineInput
                onConfirm={handleCreateChild}
                onCancel={() => setCreatingChild(null)}
                placeholder={
                  creatingChild === 'folder' ? 'Folder name…' : 'File name…'
                }
              />
            </div>
          )}

          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};
