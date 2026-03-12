import { Button } from "@/components/ui/button";
import { BLOCK_REGISTRY } from "@/utils/uxBlock";
import type { UXZone } from "@/types/ux";

type Props = {
  onAddBlock: (zone: UXZone, type: keyof typeof BLOCK_REGISTRY) => void;
};

const zoneOrder: UXZone[] = ["header", "main", "footer"];

export default function BlockLibrary({ onAddBlock }: Props) {
  return (
    <div className="h-full overflow-y-auto border-r bg-white p-3">
      <div className="mb-3 text-sm font-semibold text-slate-700">THƯ VIỆN BLOCK</div>

      <div className="space-y-4">
        {zoneOrder.map((zone) => {
          const defs = Object.values(BLOCK_REGISTRY).filter((item) => item.zone === zone);

          return (
            <div key={zone} className="space-y-2">
              <div className="text-xs font-bold uppercase text-muted-foreground">{zone}</div>

              {defs.map((def) => (
                <div
                  key={def.type}
                  className="rounded-md border bg-slate-50 p-2"
                >
                  <div className="text-sm font-medium">{def.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {def.description}
                  </div>

                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    size="sm"
                    onClick={() => onAddBlock(zone, def.type)}
                  >
                    + Thêm
                  </Button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}