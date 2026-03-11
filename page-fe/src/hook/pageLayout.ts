/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  createPageLayout,
  deletePageLayout,
  fetchPageLayoutById,
  fetchPageLayouts,
  updatePageLayout,
  updatePageLayoutActive,
} from "@/utils/api";
import {
  createDefaultBlock,
  createDefaultLayoutJson,
  createEmptyLayoutJson,
  DEFAULT_TENANT_ID,
} from "@/pages/layout/data";
import type {
  LayoutBlock,
  LayoutJson,
  LayoutZone,
  PageLayoutEntity,
  PageLayoutFormState,
  SelectedBlockRef,
} from "@/types/layout";

function reindexBlocks(blocks: LayoutBlock[]): LayoutBlock[] {
  return [...blocks]
    .sort((a, b) => a.sort - b.sort)
    .map((block, index) => ({
      ...block,
      sort: index + 1,
    }));
}

export function usePageLayoutEditor() {
  const [items, setItems] = useState<PageLayoutEntity[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlockRef | null>(
    null,
  );

  const [form, setForm] = useState<PageLayoutFormState>({
    selectedId: "",
    tenantId: DEFAULT_TENANT_ID,
    name: "",
    version: 1,
    layoutType: "landing",
    isActive: true,
    cssBundlePath: null,
  });

  const [layoutJson, setLayoutJson] = useState<LayoutJson>(
    createDefaultLayoutJson(),
  );

  async function loadList() {
    setLoadingList(true);
    try {
      const result = await fetchPageLayouts(form.tenantId);
      setItems(result);
    } catch (error: any) {
      setMessage(error?.message || "Không thể tải danh sách layout");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  async function handleSelectLayout(id: string) {
    setForm((prev) => ({
      ...prev,
      selectedId: id,
    }));

    setSelectedBlock(null);

    if (!id) {
      resetFormForCreate();
      return;
    }

    try {
      const result = await fetchPageLayoutById(id);

      setForm({
        selectedId: result.id,
        tenantId: result.tenantId,
        name: result.name,
        version: result.version,
        layoutType: result.layoutType ?? "default",
        isActive: result.isActive,
        cssBundlePath: result.cssBundlePath,
      });

      setLayoutJson(result.layoutJson || createEmptyLayoutJson());
      setMessage("Đã tải page layout");
    } catch (error: any) {
      setMessage(error?.message || "Không thể tải layout đã chọn");
    }
  }

  function resetFormForCreate() {
    setForm({
      selectedId: "",
      tenantId: DEFAULT_TENANT_ID,
      name: "",
      version: 1,
      layoutType: "landing",
      isActive: true,
      cssBundlePath: null,
    });
    setLayoutJson(createDefaultLayoutJson());
    setSelectedBlock(null);
    setMessage("Đang ở chế độ tạo mới");
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      setMessage("Name là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const created = await createPageLayout({
        tenantId: form.tenantId,
        name: form.name.trim(),
        version: form.version,
        layoutType: form.layoutType,
        layoutJson,
        cssBundlePath: form.cssBundlePath,
        isActive: form.isActive,
      });

      await loadList();
      await handleSelectLayout(created.id);
      setMessage("Tạo page layout thành công");
    } catch (error: any) {
      setMessage(error?.message || "Tạo page layout thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!form.selectedId) {
      setMessage("Bạn chưa chọn page layout để update");
      return;
    }

    if (!form.name.trim()) {
      setMessage("Name là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      await updatePageLayout(form.selectedId, {
        name: form.name.trim(),
        version: form.version,
        layoutType: form.layoutType,
        layoutJson,
        cssBundlePath: form.cssBundlePath,
        isActive: form.isActive,
      });

      await loadList();
      setMessage("Cập nhật page layout thành công");
    } catch (error: any) {
      setMessage(error?.message || "Cập nhật page layout thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.selectedId) {
      setMessage("Bạn chưa chọn page layout để xóa");
      return;
    }

    const ok = window.confirm("Bạn có chắc muốn xóa page layout này?");
    if (!ok) return;

    setSaving(true);
    try {
      await deletePageLayout(form.selectedId);
      await loadList();
      resetFormForCreate();
      setMessage("Xóa page layout thành công");
    } catch (error: any) {
      setMessage(error?.message || "Xóa page layout thất bại");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(nextValue: boolean) {
    setForm((prev) => ({
      ...prev,
      isActive: nextValue,
    }));

    if (!form.selectedId) return;

    try {
      await updatePageLayoutActive(form.selectedId, nextValue);
      await loadList();
      setMessage("Cập nhật trạng thái active thành công");
    } catch (error: any) {
      setMessage(error?.message || "Cập nhật trạng thái active thất bại");
    }
  }

  function updateForm<K extends keyof PageLayoutFormState>(
    key: K,
    value: PageLayoutFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function addBlock(zone: LayoutZone, type: LayoutBlock["type"]) {
    setLayoutJson((prev) => {
      const currentBlocks = prev.zones[zone];
      const nextSort =
        currentBlocks.length > 0
          ? Math.max(...currentBlocks.map((block) => block.sort)) + 1
          : 1;

      const nextBlock = createDefaultBlock(zone, type, nextSort);

      return {
        ...prev,
        zones: {
          ...prev.zones,
          [zone]: [...currentBlocks, nextBlock],
        },
      };
    });
  }

  function removeBlock(zone: LayoutZone, blockId: string) {
    setLayoutJson((prev) => {
      const nextBlocks = prev.zones[zone].filter((block) => block.id !== blockId);

      return {
        ...prev,
        zones: {
          ...prev.zones,
          [zone]: reindexBlocks(nextBlocks),
        },
      };
    });

    if (selectedBlock?.blockId === blockId) {
      setSelectedBlock(null);
    }
  }

  function toggleBlock(zone: LayoutZone, blockId: string) {
    setLayoutJson((prev) => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: prev.zones[zone].map((block) =>
          block.id === blockId
            ? { ...block, isEnabled: !block.isEnabled }
            : block,
        ),
      },
    }));
  }

  function moveBlock(zone: LayoutZone, blockId: string, direction: "up" | "down") {
    setLayoutJson((prev) => {
      const blocks = [...prev.zones[zone]].sort((a, b) => a.sort - b.sort);
      const index = blocks.findIndex((block) => block.id === blockId);

      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= blocks.length) return prev;

      const temp = blocks[index];
      blocks[index] = blocks[targetIndex];
      blocks[targetIndex] = temp;

      return {
        ...prev,
        zones: {
          ...prev.zones,
          [zone]: reindexBlocks(blocks),
        },
      };
    });
  }

  function updateBlockOptions(
    zone: LayoutZone,
    blockId: string,
    nextOptions: Record<string, unknown>,
  ) {
    setLayoutJson((prev) => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: prev.zones[zone].map((block) =>
          block.id === blockId
            ? {
                ...block,
                options: nextOptions,
              }
            : block,
        ),
      },
    }));
  }

  const selectedBlockData = useMemo(() => {
    if (!selectedBlock) return null;

    return (
      layoutJson.zones[selectedBlock.zone].find(
        (block) => block.id === selectedBlock.blockId,
      ) || null
    );
  }, [layoutJson, selectedBlock]);

  return {
    items,
    loadingList,
    saving,
    message,
    form,
    layoutJson,
    selectedBlock,
    selectedBlockData,
    setSelectedBlock,
    updateForm,
    handleSelectLayout,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    resetFormForCreate,
    addBlock,
    removeBlock,
    toggleBlock,
    moveBlock,
    updateBlockOptions,
  };
}