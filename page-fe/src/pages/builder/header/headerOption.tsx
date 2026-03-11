/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import type { HeaderConfig, HeaderItem, RowKey, SlotKey } from "@/types/header";
import { findItem } from "@/types/header";
import { headerItemSchemas } from "@/types/header";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Mode = "structure" | "properties";

function rowLabel(row: RowKey) {
  return row === "top" ? "Top bar" : row === "main" ? "Header main" : "Header bottom";
}

export default function HeaderInspectorLeft({
  value,
  onChange,
}: {
  value: HeaderConfig;
  onChange: (next: HeaderConfig) => void;
}) {
  const [mode, setMode] = useState<Mode>("structure");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem: HeaderItem | null = useMemo(() => {
    if (!selectedItemId) return null;
    return findItem(value, selectedItemId);
  }, [value, selectedItemId]);

  const schema = selectedItem
    ? headerItemSchemas[selectedItem.type] ?? {
        title: selectedItem.label,
        fields: [{ key: "visible", label: "Hiển thị", type: "boolean" as const }],
      }
    : null;

  const pick = (id: string) => {
    setSelectedItemId(id);
    setMode("properties");
  };

  const patchItemProps = (patch: Record<string, any>) => {
    if (!selectedItem) return;
    const next: HeaderConfig = structuredClone(value);

    // update in notInUse
    const idxNI = next.notInUse.findIndex((x) => x.id === selectedItem.id);
    if (idxNI >= 0) {
      next.notInUse[idxNI].props = { ...(next.notInUse[idxNI].props ?? {}), ...patch };
      onChange(next);
      return;
    }

    // update in layout
    for (const row of ["top", "main", "bottom"] as RowKey[]) {
      for (const col of ["left", "center", "right"] as SlotKey[]) {
        const idx = next.layout[row][col].findIndex((x) => x.id === selectedItem.id);
        if (idx >= 0) {
          next.layout[row][col][idx].props = { ...(next.layout[row][col][idx].props ?? {}), ...patch };
          onChange(next);
          return;
        }
      }
    }
  };

  const renderSlot = (row: RowKey, col: SlotKey) => {
    const items = value.layout[row][col];
    return (
      <div className="rounded-xl border bg-muted/20 p-2 min-h-[60px]">
        <div className="mb-2 text-xs text-muted-foreground flex items-center justify-between">
          <span className="uppercase">{col}</span>
          <Badge variant="outline">{items.length}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => pick(it.id)}
              className="rounded-lg border bg-background px-2 py-1 text-xs hover:bg-muted"
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (mode === "properties" && selectedItem) {
    return (
      <div className="space-y-3">
        <Button variant="outline" onClick={() => setMode("structure")}>
          ← Back
        </Button>

        <Card className="p-3">
          <div className="font-semibold">{schema?.title ?? selectedItem.label}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <code>{selectedItem.id}</code> • <code>{selectedItem.type}</code>
          </div>
        </Card>

        <Card className="p-3 space-y-3">
          {(schema?.fields ?? []).map((f: any) => {
            const v = (selectedItem.props ?? {})[f.key];

            if (f.type === "boolean") {
              return (
                <div key={f.key} className="flex items-center justify-between">
                  <div className="text-sm">{f.label}</div>
                  <Switch checked={Boolean(v ?? true)} onCheckedChange={(val) => patchItemProps({ [f.key]: val })} />
                </div>
              );
            }

            return (
              <div key={f.key} className="space-y-1">
                <div className="text-sm">{f.label}</div>
                <Input value={String(v ?? "")} onChange={(e) => patchItemProps({ [f.key]: e.target.value })} />
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-3">
        <div className="font-semibold">Header Items</div>
        <div className="text-xs text-muted-foreground">Click item để chỉnh properties</div>
      </Card>

      {(["top", "main", "bottom"] as RowKey[]).map((row) => (
        <div key={row} className="space-y-2">
          <div className="text-sm font-semibold">{rowLabel(row)}</div>
          <div className="grid grid-cols-3 gap-2">
            {renderSlot(row, "left")}
            {renderSlot(row, "center")}
            {renderSlot(row, "right")}
          </div>
        </div>
      ))}

      <Separator />

      <div className="space-y-2">
        <div className="text-sm font-semibold">Not in use</div>
        <div className="flex flex-wrap gap-2">
          {value.notInUse.map((it) => (
            <button
              key={it.id}
              onClick={() => pick(it.id)}
              className="rounded-lg border bg-background px-2 py-1 text-xs hover:bg-muted"
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}