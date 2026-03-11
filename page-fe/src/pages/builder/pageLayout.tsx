/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

import HeaderBuilderPanel from "@/pages/builder/header/headerBuilder";
import HeaderInspectorLeft from "@/pages/builder/header/headerOption";
import { makeDefaultHeaderConfig } from "@/types/header";

export type LayoutNode = {
  id: string;
  blockKey: string;
  props: Record<string, any>;
  children?: LayoutNode[];
};

import { renderNode, isContainerBlock } from "@/pages/builder/registry";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

type LeftMode = "structure" | "add" | "properties";

const BLOCK_CATALOG = [
  { blockKey: "section", name: "Section" },
  { blockKey: "columns", name: "Columns" },
  { blockKey: "heading", name: "Heading" },
  { blockKey: "text", name: "Paragraph" },
  { blockKey: "button", name: "Button" },
  { blockKey: "image", name: "Image" },
  { blockKey: "richText", name: "RichText" },
  { blockKey: "header", name: "Header (Builder)" }, 
];

export default function PageLayoutEditor() {
  // root layout
  const [root, setRoot] = useState<LayoutNode>({
    id: "root",
    blockKey: "section",
    props: { paddingY: 40, bgColor: "#fff" },
    children: [],
  });

  const [selectedId, setSelectedId] = useState<string>("root");
  const [leftMode, setLeftMode] = useState<LeftMode>("structure");

  const selectedNode = useMemo(() => {
    const walk = (n: LayoutNode): LayoutNode | null => {
      if (n.id === selectedId) return n;
      for (const c of n.children ?? []) {
        const found = walk(c);
        if (found) return found;
      }
      return null;
    };
    return walk(root);
  }, [root, selectedId]);

  const patchSelectedProps = (patch: Record<string, any>) => {
    const walk = (n: LayoutNode): LayoutNode => {
      if (n.id === selectedId) {
        return { ...n, props: { ...n.props, ...patch } };
      }
      return { ...n, children: (n.children ?? []).map(walk) };
    };
    setRoot(walk(root));
  };

  const addBlockToSelected = (blockKey: string) => {
    const node: LayoutNode = {
      id: newId(),
      blockKey,
      props: {},
      children: isContainerBlock(blockKey) ? [] : undefined,
    };

    // ✅ inject default headerConfig when adding header
    if (blockKey === "header") {
      node.props.headerConfig = makeDefaultHeaderConfig();
    }

    const walk = (n: LayoutNode): LayoutNode => {
      if (n.id === selectedId) {
        const canHaveChildren = isContainerBlock(n.blockKey);
        if (!canHaveChildren) return n;
        return { ...n, children: [...(n.children ?? []), node] };
      }
      return { ...n, children: (n.children ?? []).map(walk) };
    };

    setRoot(walk(root));
    setSelectedId(node.id);
    setLeftMode("properties");
  };

  // ===== Left panel (Structure / Add / Properties) =====
  const LeftPanel = () => {
    if (leftMode === "add") {
      return (
        <div className="space-y-3">
          <Button variant="outline" onClick={() => setLeftMode("structure")}>
            ← Back
          </Button>

          <Card className="p-3">
            <div className="font-semibold">Add block</div>
            <div className="text-xs text-muted-foreground">Chọn block để thêm vào node đang chọn</div>
          </Card>

          <div className="grid grid-cols-1 gap-2">
            {BLOCK_CATALOG.map((b) => (
              <Button key={b.blockKey} variant="secondary" onClick={() => addBlockToSelected(b.blockKey)}>
                {b.name}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    if (leftMode === "properties") {
      if (!selectedNode) return <div className="text-sm text-muted-foreground">No selection</div>;

      if (selectedNode.blockKey === "header") {
        return (
          <HeaderInspectorLeft
            value={selectedNode.props.headerConfig ?? makeDefaultHeaderConfig()}
            onChange={(nextCfg) => patchSelectedProps({ headerConfig: nextCfg })}
          />
        );
      }

      return (
        <div className="space-y-3">
          <Button variant="outline" onClick={() => setLeftMode("structure")}>
            ← Back
          </Button>

          <Card className="p-3">
            <div className="font-semibold">Properties</div>
            <div className="text-xs text-muted-foreground">
              Selected: <code>{selectedNode.blockKey}</code> • <code>{selectedNode.id}</code>
            </div>
          </Card>

          <Card className="p-3 text-sm text-muted-foreground">
            (Demo) Bạn sẽ nối props_schema sau. Hiện tại header có inspector riêng.
          </Card>
        </div>
      );
    }

    // structure mode
    return (
      <div className="space-y-3">
        <Card className="p-3">
          <div className="font-semibold">Structure</div>
          <div className="text-xs text-muted-foreground">Click node để chọn → properties</div>
        </Card>

        <div className="space-y-2">
          <TreeNode node={root} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setLeftMode("properties"); }} />
        </div>

        <Separator />

        <Button onClick={() => setLeftMode("add")}>+ Add block</Button>
      </div>
    );
  };

  // ===== Preview =====
  const Preview = () => {
    if (selectedNode?.blockKey === "header") {
      return (
        <div className="p-4">
          <HeaderBuilderPanel
            height={420}
            value={selectedNode.props.headerConfig ?? makeDefaultHeaderConfig()}
            onChange={(nextCfg) => patchSelectedProps({ headerConfig: nextCfg })}
          />
        </div>
      );
    }

    return (
      <div className="p-4">
        {renderNode(root as any)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-muted/30">
      <div className="h-full w-full grid grid-cols-[340px_1fr]">
        <aside className="h-full border-r bg-background">
          <div className="h-12 px-3 flex items-center justify-between border-b">
            <div className="font-semibold">Page Layout</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setLeftMode("structure")}>Structure</Button>
              <Button size="sm" variant="outline" onClick={() => setLeftMode("properties")}>Properties</Button>
            </div>
          </div>
          <div className="p-3 overflow-auto h-[calc(100%-3rem)]">
            <LeftPanel />
          </div>
        </aside>

        <main className="h-full overflow-auto bg-background">
          <Preview />
        </main>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  selectedId,
  onSelect,
  depth = 0,
}: {
  node: LayoutNode;
  selectedId: string;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  const selected = node.id === selectedId;
  return (
    <div>
      <button
        onClick={() => onSelect(node.id)}
        className={[
          "w-full text-left rounded-lg px-2 py-1 text-sm border",
          selected ? "bg-muted border-foreground/20" : "bg-background hover:bg-muted/50 border-transparent",
        ].join(" ")}
        style={{ marginLeft: depth * 12 }}
      >
        <span className="font-medium">{node.blockKey}</span>
        <span className="text-xs text-muted-foreground"> • {node.id}</span>
      </button>

      {(node.children ?? []).map((c) => (
        <TreeNode key={c.id} node={c} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
}