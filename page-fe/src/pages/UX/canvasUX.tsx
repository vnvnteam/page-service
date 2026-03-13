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
  const safeContent: UXContentJson = {
    header: content?.header ?? [],
    main: content?.main ?? [],
    footer: content?.footer ?? [],
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4">
      <div className="space-y-4">
        {zones.map((zone) => {
          const blocks = safeContent[zone];

          return (
            <div key={zone} className="rounded-md border bg-white">
              <div className="border-b px-4 py-3 text-sm font-semibold uppercase text-slate-700">
                {zone}
              </div>

              <div className="space-y-3 p-4">
                {blocks.length === 0 && (
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    Chưa có block nào trong {zone}
                  </div>
                )}

                {blocks.map((block, index) => {
                  const isSelected =
                    selected?.zone === zone && selected?.blockId === block.id;

                  return (
                    <BlockRow
                      key={block.id}
                      zone={zone}
                      block={block}
                      index={index}
                      total={blocks.length}
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
          );
        })}
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

  if (!def) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-3">
        <div className="text-sm font-semibold text-red-700">
          Block type không tồn tại: {block.type}
        </div>
        <div className="mt-1 text-xs text-red-600">
          Hãy kiểm tra BLOCK_REGISTRY hoặc dữ liệu block từ server.
        </div>
      </div>
    );
  }

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