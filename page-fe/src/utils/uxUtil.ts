/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { BLOCK_REGISTRY } from "@/utils/uxBlock";
import type {
  SelectedBlockRef,
  UXBlock,
  UXBlockType,
  UXContentJson,
  UXZone,
} from "@/types/ux";

/* -- utils-UX-builder -- */
export function createEmptyContentJson(): UXContentJson {
  return {
    header: [],
    main: [],
    footer: [],
  };
}

export function createBlock(type: UXBlockType): UXBlock {
  const def = BLOCK_REGISTRY[type];
  return {
    id: crypto.randomUUID(),
    type,
    props: { ...def.defaultProps },
  };
}

export function getZoneBlocks(content: UXContentJson, zone: UXZone): UXBlock[] {
  return content[zone] ?? [];
}

export function replaceZoneBlocks(
  content: UXContentJson,
  zone: UXZone,
  nextBlocks: UXBlock[],
): UXContentJson {
  return {
    ...content,
    [zone]: nextBlocks,
  };
}

export function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const nextIndex = index + dir;
  if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return list;
  const copy = [...list];
  const temp = copy[index];
  copy[index] = copy[nextIndex];
  copy[nextIndex] = temp;
  return copy;
}

export function itemsTextToArray(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/* -- use-UX-builder -- */
function normalizeContentJson(
  content?: Partial<UXContentJson> | null,
): UXContentJson {
  return {
    header: content?.header ?? [],
    main: content?.main ?? [],
    footer: content?.footer ?? [],
  };
}

export function useUXBuilder(initialContent?: UXContentJson | null) {
  const [content, setContent] = useState<UXContentJson>(() =>
    normalizeContentJson(initialContent),
  );
  const [selected, setSelected] = useState<SelectedBlockRef>(null);

  useEffect(() => {
    setContent(normalizeContentJson(initialContent));
    setSelected(null);
  }, [initialContent]);

  const selectedBlock = useMemo(() => {
    if (!selected) return null;
    return (
      content[selected.zone].find((b) => b.id === selected.blockId) ?? null
    );
  }, [content, selected]);

  function addBlock(zone: UXZone, type: UXBlockType) {
    const block = createBlock(type);
    setContent((prev) => replaceZoneBlocks(prev, zone, [...prev[zone], block]));
    setSelected({ zone, blockId: block.id });
  }

  function removeBlock(zone: UXZone, blockId: string) {
    setContent((prev) =>
      replaceZoneBlocks(
        prev,
        zone,
        prev[zone].filter((b) => b.id !== blockId),
      ),
    );

    if (selected?.blockId === blockId) {
      setSelected(null);
    }
  }

  function moveBlock(zone: UXZone, blockId: string, dir: -1 | 1) {
    setContent((prev) => {
      const index = prev[zone].findIndex((b) => b.id === blockId);
      if (index < 0) return prev;
      return replaceZoneBlocks(prev, zone, moveItem(prev[zone], index, dir));
    });
  }

  function updateBlockProps(
    zone: UXZone,
    blockId: string,
    nextProps: Record<string, any>,
  ) {
    setContent((prev) =>
      replaceZoneBlocks(
        prev,
        zone,
        prev[zone].map((b) =>
          b.id === blockId ? { ...b, props: nextProps } : b,
        ),
      ),
    );
  }

  function replaceContent(nextContent: UXContentJson) {
    setContent(nextContent);
    setSelected(null);
  }

  return {
    content,
    setContent,
    replaceContent,
    selected,
    setSelected,
    selectedBlock,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlockProps,
  };
}
