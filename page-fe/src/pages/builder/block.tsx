import { useMemo } from "react";
import type { BlockDefinition } from "@/utils/catalog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function BlockPicker({
  blocks,
  onPick,
  onBack,
  targetLabel,
}: {
  blocks: BlockDefinition[];
  onPick: (def: BlockDefinition) => void;
  onBack: () => void;
  targetLabel: string;
}) {
  const blocksByCategory = useMemo(() => {
    return blocks.reduce<Record<string, BlockDefinition[]>>((acc, b) => {
      const k = b.category ?? "other";
      acc[k] ??= [];
      acc[k].push(b);
      return acc;
    }, {});
  }, [blocks]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div className="text-xs text-muted-foreground">
          Target: <b>{targetLabel}</b>
        </div>
      </div>

      <Separator />

      <ScrollArea className="h-[70vh] pr-3">
        <div className="space-y-5">
          {Object.entries(blocksByCategory).map(([cat, list]) => (
            <div key={cat} className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{cat}</div>

              <div className="grid gap-2">
                {list.map((def) => (
                  <button
                    key={def.id}
                    type="button"
                    onClick={() => onPick(def)}
                    className="w-full rounded-xl border p-3 text-left hover:bg-muted transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold">{def.name}</div>
                    </div>
                    {def.props_schema?.display?.help ? (
                      <div className="mt-1 text-xs text-muted-foreground">{def.props_schema.display.help}</div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
