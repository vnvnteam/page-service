import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { UXContentJson } from "@/types/ux";

import BlockLibrary from "@/pages/UX/blockUX";
import BlockProperties from "@/pages/UX/propertiesUX";
import LayoutCanvas from "@/pages/UX/canvasUX";
import PreviewRenderer from "@/pages/UX/previewUX";

import { useUXBuilder } from "@/utils/uxUtil";
import { useAdminNav } from "@/utils/nav";
import { updatePage } from "@/utils/api";

type Props = {
  initialContent?: UXContentJson | null;
  onSave?: (content: UXContentJson) => void;
};

export default function UXBuilder({ initialContent, onSave }: Props) {
  const nav = useAdminNav();

  const pageId =
    (nav.activeParams?.id as string | undefined) ?? undefined;

  const navContent =
    (nav.activeParams?.contentJson as UXContentJson | undefined) ?? undefined;

  const effectiveInitialContent = initialContent ?? navContent;

  const vm = useUXBuilder(effectiveInitialContent);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Nếu muốn debug:
    console.log("UXBuilder pageId =", pageId);
    console.log("UXBuilder navContent =", navContent);
  }, [pageId, navContent]);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (onSave) {
        await Promise.resolve(onSave(vm.content));
        return;
      }

      if (!pageId) {
        alert("Thiếu id trang");
        return;
      }

      await updatePage(pageId, {
        contentJson: vm.content,
      });

      nav.goBack();
    } catch (error) {
      console.error("Save UX content failed:", error);
      alert("Lưu hiển thị thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div>
          <div className="text-base font-semibold">UX Builder</div>
          <div className="text-xs text-muted-foreground">
            Tab hiển thị chỉnh block từ content_json
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => nav.goBack()} disabled={!nav.canGoBack}>
            QUAY LẠI
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "ĐANG LƯU..." : "LƯU HIỂN THỊ"}
          </Button>
        </div>
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