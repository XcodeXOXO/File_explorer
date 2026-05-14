export type NodeType = 'file' | 'folder';

export interface ExplorerNode {
  id: string;
  name: string;
  type: NodeType;
  isExpanded?: boolean;
  children?: ExplorerNode[];
}
