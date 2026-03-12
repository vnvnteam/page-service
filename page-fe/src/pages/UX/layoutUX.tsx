import { Button } from "@/components/ui/button";
import BlockLibrary from "@/pages/UX/blockUX";
import BlockProperties from "@/pages/UX/propertiesUX";
import LayoutCanvas from "@/pages/UX/canvasUX";
import PreviewRenderer from "@/pages/UX/previewUX";
import { useUXBuilder } from "@/utils/uxUtil";
import type { UXContentJson } from "@/types/ux";

type Props = {
  initialContent: UXContentJson;
  onSave?: (content: UXContentJson) => void;
};

export default function UXBuilder({ initialContent, onSave }: Props) {
  const vm = useUXBuilder(initialContent);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div>
          <div className="text-base font-semibold">UX Builder</div>
          <div className="text-xs text-muted-foreground">
            Tab hiển thị chỉnh block từ content_json
          </div>
        </div>

        <Button onClick={() => onSave?.(vm.content)}>LƯU HIỂN THỊ</Button>
      </div>

      <div className="grid h-full min-h-0 grid-cols-[240px_420px_1fr_320px]">
        <BlockLibrary onAddBlock={vm.addBlock} />

        <LayoutCanvas
          content={vm.content}
          selected={vm.selected}
          onSelect={vm.setSelected}
          onMove={vm.moveBlock}
          onRemove={vm.removeBlock}
        />

        <PreviewRenderer content={vm.content} />

        <BlockProperties
          zone={vm.selected?.zone ?? null}
          block={vm.selectedBlock}
          onChange={vm.updateBlockProps}
        />
      </div>
    </div>
  );
}