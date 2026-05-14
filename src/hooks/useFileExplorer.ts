import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExplorerNode, NodeType } from '../types';

// ─── Pure recursive tree operations (immutable) ──────────────────────────────

/**
 * Inserts a new node under the node with `parentId`.
 * Returns the same tree reference if parentId isn't found or if the
 * parent is a file (files cannot have children).
 */
export function insertNode(
  tree: ExplorerNode[],
  parentId: string | null,
  newNode: ExplorerNode
): ExplorerNode[] {
  // null parentId ⟹ insert at root level
  if (parentId === null) {
    return [...tree, newNode];
  }

  return tree.map((node) => {
    if (node.id === parentId) {
      // Guard: only folders can contain children
      if (node.type !== 'folder') return node;
      return {
        ...node,
        isExpanded: true,
        children: [...(node.children ?? []), newNode],
      };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: insertNode(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

/**
 * Renames the node whose id equals `nodeId`.
 * Ignores empty / whitespace-only names.
 */
export function editNode(
  tree: ExplorerNode[],
  nodeId: string,
  newName: string
): ExplorerNode[] {
  const trimmed = newName.trim();
  if (!trimmed) return tree; // edge-case: empty name → no-op

  return tree.map((node) => {
    if (node.id === nodeId) {
      return { ...node, name: trimmed };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: editNode(node.children, nodeId, newName) };
    }
    return node;
  });
}

/**
 * Removes the node with `nodeId` from the tree (and any subtree beneath it).
 */
export function deleteNode(
  tree: ExplorerNode[],
  nodeId: string
): ExplorerNode[] {
  return tree
    .filter((node) => node.id !== nodeId)
    .map((node) => {
      if (node.children && node.children.length > 0) {
        return { ...node, children: deleteNode(node.children, nodeId) };
      }
      return node;
    });
}

/**
 * Toggles the `isExpanded` flag of a folder node.
 */
export function toggleNode(
  tree: ExplorerNode[],
  nodeId: string
): ExplorerNode[] {
  return tree.map((node) => {
    if (node.id === nodeId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: toggleNode(node.children, nodeId) };
    }
    return node;
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFileExplorer() {
  const [nodes, setNodes] = useState<ExplorerNode[]>([]);

  const createNode = useCallback(
    (type: NodeType, name: string, parentId: string | null = null) => {
      const trimmed = name.trim();
      if (!trimmed) return; // guard empty name

      const newNode: ExplorerNode = {
        id: uuidv4(),
        name: trimmed,
        type,
        isExpanded: type === 'folder' ? false : undefined,
        children: type === 'folder' ? [] : undefined,
      };

      setNodes((prev) => insertNode(prev, parentId, newNode));
    },
    []
  );

  const rename = useCallback((nodeId: string, newName: string) => {
    setNodes((prev) => editNode(prev, nodeId, newName));
  }, []);

  const remove = useCallback((nodeId: string) => {
    setNodes((prev) => deleteNode(prev, nodeId));
  }, []);

  const toggle = useCallback((nodeId: string) => {
    setNodes((prev) => toggleNode(prev, nodeId));
  }, []);

  return { nodes, createNode, rename, remove, toggle };
}
