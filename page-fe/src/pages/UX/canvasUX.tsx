import { Button } from "@/components/ui/button";
import { BLOCK_REGISTRY } from "@/utils/uxBlock";
import type { SelectedBlockRef, UXBlock, UXContentJson, UXZone } from "@/types/ux";

type Props = {
  content: UXContentJson;
  selected: SelectedBlockRef;
  onSelect: (value: SelectedBlockRef) => void;
  onMove: (zone: UXZone, blockId: string, dir: -1 | 1) => void;
  onRemove: (zone: UXZone, blockId: string) => void;
};

const zones: UXZone[] = ["header", "main", "footer"];

export default function LayoutCanvas({
  content,
  selected,
  onSelect,
  onMove,
  onRemove,
}: Props) {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4">
      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone} className="rounded-md border bg-white">
            <div className="border-b px-4 py-3 text-sm font-semibold uppercase text-slate-700">
              {zone}
            </div>

            <div className="space-y-3 p-4">
              {content[zone].length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  Chưa có block nào trong {zone}
                </div>
              )}

              {content[zone].map((block, index) => {
                const isSelected =
                  selected?.zone === zone && selected?.blockId === block.id;

                return (
                  <BlockRow
                    key={block.id}
                    zone={zone}
                    block={block}
                    index={index}
                    total={content[zone].length}
                    isSelected={isSelected}
                    onSelect={() => onSelect({ zone, blockId: block.id })}
                    onMoveUp={() => onMove(zone, block.id, -1)}
                    onMoveDown={() => onMove(zone, block.id, 1)}
                    onRemove={() => onRemove(zone, block.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockRow({
  zone,
  block,
  index,
  total,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  zone: UXZone;
  block: UXBlock;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const def = BLOCK_REGISTRY[block.type];

  return (
    <div
      className={`rounded-md border p-3 transition ${
        isSelected ? "border-sky-500 bg-sky-50" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="flex-1 text-left"
          onClick={onSelect}
        >
          <div className="text-sm font-semibold text-slate-800">{def.label}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            zone: {zone} · block: {block.type}
          </div>
        </button>

        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={onMoveUp} disabled={index === 0}>
            ↑
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onMoveDown}
            disabled={index === total - 1}
          >
            ↓
          </Button>
          <Button size="sm" variant="outline" onClick={onRemove}>
            X
          </Button>
        </div>
      </div>
    </div>
  );
}