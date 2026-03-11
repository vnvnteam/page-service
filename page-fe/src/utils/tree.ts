/* eslint-disable @typescript-eslint/no-explicit-any */
import { LayoutNode, UUID } from "@/types/block";

export function findNode(nodes: LayoutNode[], id: UUID): LayoutNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const ch = n.children ?? [];
    const f = findNode(ch, id);
    if (f) return f;
  }
  return null;
}

export function updateNodeProps(nodes: LayoutNode[], id: UUID, patch: Record<string, any>): LayoutNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, props: { ...n.props, ...patch } };
    return { ...n, children: n.children ? updateNodeProps(n.children, id, patch) : undefined };
  });
}

export function removeNode(nodes: LayoutNode[], id: UUID): LayoutNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: n.children ? removeNode(n.children, id) : undefined }));
}

export function insertChild(nodes: LayoutNode[], parentId: UUID | "ROOT", node: LayoutNode): LayoutNode[] {
  if (parentId === "ROOT") return [...nodes, node];
  return nodes.map((n) => {
    if (n.id === parentId) return { ...n, children: [...(n.children ?? []), node] };
    return { ...n, children: n.children ? insertChild(n.children, parentId, node) : undefined };
  });
}

function moveInArray<T>(arr: T[], from: number, to: number) {
  const a = [...arr];
  const [x] = a.splice(from, 1);
  a.splice(to, 0, x);
  return a;
}

export function moveSibling(nodes: LayoutNode[], nodeId: UUID, dir: -1 | 1): LayoutNode[] {
  const idx = nodes.findIndex((n) => n.id === nodeId);
  if (idx !== -1) {
    const to = idx + dir;
    if (to < 0 || to >= nodes.length) return nodes;
    return moveInArray(nodes, idx, to);
  }
  return nodes.map((n) => ({
    ...n,
    children: n.children ? moveSibling(n.children, nodeId, dir) : undefined,
  }));
}
