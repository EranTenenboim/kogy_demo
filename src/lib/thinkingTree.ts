import type { ThinkingNode, NodeStatus } from '../types';

export function cloneTree(nodes: ThinkingNode[]): ThinkingNode[] {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? cloneTree(n.children) : undefined,
  }));
}

export function mapTree(
  nodes: ThinkingNode[],
  nodeId: string,
  updater: (node: ThinkingNode) => ThinkingNode,
): ThinkingNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return updater(node);
    }
    if (node.children) {
      return { ...node, children: mapTree(node.children, nodeId, updater) };
    }
    return node;
  });
}

export function setNodeStatus(
  nodes: ThinkingNode[],
  nodeId: string,
  status: NodeStatus,
  detail?: string,
): ThinkingNode[] {
  return mapTree(nodes, nodeId, (node) => ({
    ...node,
    status,
    detail: detail ?? node.detail,
  }));
}

export function freezeTree(nodes: ThinkingNode[]): ThinkingNode[] {
  return nodes.map((node) => ({
    ...node,
    status:
      node.status === 'active' || node.status === 'pending'
        ? 'skipped'
        : node.status,
    children: node.children ? freezeTree(node.children) : undefined,
  }));
}
