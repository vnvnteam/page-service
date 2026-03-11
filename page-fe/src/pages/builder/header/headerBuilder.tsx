/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { HeaderConfig, RowKey, SlotKey } from "@/types/header";
import { makeDefaultHeaderConfig } from "@/types/header";

export default function HeaderBuilderPanel({
  height = 320,
  value,
  onChange,
}: {
  height?: number;
  value: HeaderConfig;
  onChange: (next: HeaderConfig) => void;
}) {
  const layout = value.layout;
  const notInUse = value.notInUse;

  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const pendingItem = useMemo(
    () => notInUse.find((i) => i.id === pendingItemId) ?? null,
    [notInUse, pendingItemId]
  );

  const emit = (next: HeaderConfig) => {
    onChange(next);
  };

  const placePendingToSlot = (row: RowKey, col: SlotKey) => {
    if (!pendingItem) return;

    // ✅ tránh add trùng
    const alreadyInSlot = layout[row][col].some((x) => x.id === pendingItem.id);
    if (alreadyInSlot) {
      setPendingItemId(null);
      return;
    }

    const next: HeaderConfig = structuredClone(value);
    next.notInUse = next.notInUse.filter((x) => x.id !== pendingItem.id);
    next.layout[row][col].push(pendingItem);

    setPendingItemId(null);
    emit(next);
  };

  const removeFromSlot = (row: RowKey, col: SlotKey, itemId: string) => {
    const item = layout[row][col].find((x) => x.id === itemId);
    if (!item || item.type === "logo") return;

    const next: HeaderConfig = structuredClone(value);
    next.layout[row][col] = next.layout[row][col].filter((x) => x.id !== itemId);

    // ✅ tránh duplicate notInUse
    if (!next.notInUse.some((x) => x.id === item.id)) next.notInUse.push(item);
    emit(next);
  };

  const Slot = ({ row, col }: { row: RowKey; col: SlotKey }) => {
    const items = layout[row][col];

    return (
      <div
        onClick={() => placePendingToSlot(row, col)}
        className="min-h-[32px] rounded border border-dashed border-white/20 px-2 py-1 cursor-pointer hover:border-white/40 transition"
      >
        {items.length === 0 ? (
          <div className="text-[10px] text-white/30">{col}</div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {items.map((it) => (
              <div
                key={it.id}
                className="px-2 py-[2px] text-[10px] bg-white/10 border border-white/10 rounded flex items-center gap-1"
              >
                {it.label}
                {it.type !== "logo" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromSlot(row, col, it.id);
                    }}
                    className="text-red-400 text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Row = ({ title, rowKey }: { title: string; rowKey: RowKey }) => {
    return (
      <div className="relative group rounded px-1 py-1 border border-transparent group-hover:border-white/10">
        <div className="h-3">
          <div className="text-[10px] uppercase text-white/60 opacity-0 transition-opacity group-hover:opacity-100">
            {title}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-4">
            <Slot row={rowKey} col="left" />
          </div>
          <div className="col-span-5">
            <Slot row={rowKey} col="center" />
          </div>
          <div className="col-span-3">
            <Slot row={rowKey} col="right" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full rounded-xl bg-zinc-950 text-white border border-white/10"
      style={{ height }}
    >
      <div className="h-9 px-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Header Builder</div>

        <div className="flex items-center gap-2 text-xs">
          <Button size="sm" variant="secondary">
            Desktop
          </Button>
          <Button size="sm" variant="secondary">
            Mobile
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => emit(makeDefaultHeaderConfig())}
          >
            Clear
          </Button>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="px-3 py-2 space-y-1">
        <Row title="Top bar" rowKey="top" />
        <Row title="Header Main" rowKey="main" />
        <Row title="Header Bottom" rowKey="bottom" />
      </div>

      <Separator className="bg-white/10" />

      <div className="px-3 py-2">
        <div className="text-[10px] text-white/60 mb-1">
          Not in use
          {pendingItem && (
            <span className="ml-2 text-white/40">(selected: {pendingItem.label})</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {notInUse.map((it) => {
            const active = it.id === pendingItemId;
            return (
              <button
                key={it.id}
                onClick={() => setPendingItemId(it.id)}
                className={[
                  "px-2 py-[2px] text-[10px] rounded border",
                  active
                    ? "bg-blue-500/30 border-blue-300"
                    : "bg-white/10 border-white/10 hover:bg-white/20",
                ].join(" ")}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}