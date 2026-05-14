import React, { useState, useCallback } from 'react';
import { useFileExplorer } from './hooks/useFileExplorer';
import { Tree } from './components/Tree';
import { Button } from './components/Button';
import { NodeType } from './types';

// ─── Inline root creator ──────────────────────────────────────────────────────

interface RootCreatorProps {
  type: NodeType;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

const RootCreator: React.FC<RootCreatorProps> = ({ type, onConfirm, onCancel }) => {
  const [value, setValue] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commit = () => {
    if (value.trim()) onConfirm(value.trim());
    else onCancel();
  };

  return (
    <div className="root-creator">
      <span className="root-creator__icon">
        {type === 'folder' ? '📁' : '📄'}
      </span>
      <input
        ref={inputRef}
        className="root-creator__input"
        value={value}
        placeholder={type === 'folder' ? 'Folder name…' : 'File name…'}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') onCancel();
        }}
      />
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

const NewFileIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
    <path
      fillRule="evenodd"
      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
      clipRule="evenodd"
    />
  </svg>
);

const NewFolderIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    <path stroke="#fff" strokeWidth="1.5" strokeLinecap="round" d="M10 9v4M8 11h4" />
  </svg>
);

function App() {
  const { nodes, createNode, rename, remove, toggle } = useFileExplorer();
  const [rootCreating, setRootCreating] = useState<NodeType | null>(null);

  const handleCreateRoot = useCallback(
    (type: NodeType) => setRootCreating(type),
    []
  );

  const handleRootConfirm = useCallback(
    (name: string) => {
      if (rootCreating) {
        createNode(rootCreating, name, null);
        setRootCreating(null);
      }
    },
    [rootCreating, createNode]
  );

  const handleCreateChild = useCallback(
    (type: NodeType, name: string, parentId: string) => {
      createNode(type, name, parentId);
    },
    [createNode]
  );

  return (
    <div className="app">
      {/* Sidebar panel */}
      <aside className="sidebar">
        {/* Header */}
        <div className="sidebar__header">
          <span className="sidebar__logo">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#grad)" />
              <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="3" y1="3" x2="21" y2="21">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <h1 className="sidebar__title">EXPLORER</h1>
        </div>

        {/* Toolbar */}
        <div className="sidebar__toolbar">
          <span className="sidebar__section-label">STOREBOX</span>
          <div className="sidebar__toolbar-actions">
            <Button
              variant="ghost"
              size="sm"
              icon={<NewFileIcon />}
              title="New File"
              onClick={() => handleCreateRoot('file')}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<NewFolderIcon />}
              title="New Folder"
              onClick={() => handleCreateRoot('folder')}
            />
          </div>
        </div>

        {/* Root creator */}
        {rootCreating && (
          <RootCreator
            type={rootCreating}
            onConfirm={handleRootConfirm}
            onCancel={() => setRootCreating(null)}
          />
        )}

        {/* File tree */}
        <div className="sidebar__tree">
          <Tree
            nodes={nodes}
            onToggle={toggle}
            onRename={rename}
            onDelete={remove}
            onCreateChild={handleCreateChild}
          />
        </div>
      </aside>

      {/* Main editor area */}
      <main className="editor">
        <div className="editor__welcome">
          <div className="editor__welcome-icon">
            <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
              <rect width="80" height="80" rx="16" fill="url(#edGrad)" />
              <path d="M24 40l12 12 20-24" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="edGrad" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="editor__welcome-title">StoreBox File Explorer</h2>
          <p className="editor__welcome-subtitle">
            Create and organise your files and folders using the explorer panel on the left.
          </p>
          <div className="editor__shortcuts">
            <div className="shortcut">
              <kbd>Click</kbd>
              <span>Expand / collapse folder</span>
            </div>
            <div className="shortcut">
              <kbd>Hover</kbd>
              <span>Reveal actions</span>
            </div>
            <div className="shortcut">
              <kbd>Enter</kbd>
              <span>Confirm rename / create</span>
            </div>
            <div className="shortcut">
              <kbd>Esc</kbd>
              <span>Cancel input</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
