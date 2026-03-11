import type { LayoutBlock, LayoutJson, LayoutZone } from "@/types/layout";

function blockDefaults(type: LayoutBlock["type"]): Record<string, unknown> {
  switch (type) {
    case "logo":
      return {
        text: "VN CMS 3.0",
      };

    case "navigation":
      return {
        items: ["Trang chủ", "Giới thiệu", "Liên hệ"],
        align: "right",
      };

    case "banner":
      return {
        title: "Banner chính",
        subtitle: "Đây là banner demo",
        buttonText: "Xem thêm",
        backgroundImage: "",
      };

    case "section":
      return {
        title: "Section nội dung",
        description: "Mô tả ngắn cho section",
        columns: 1,
      };

    case "footer_menu":
      return {
        items: ["Chính sách", "Điều khoản", "Hỗ trợ"],
      };

    case "copyright":
      return {
        text: "© 2026 VN CMS",
      };

    default:
      return {};
  }
}

export function createDefaultBlock(
  zone: LayoutZone,
  type: LayoutBlock["type"],
  sort: number,
): LayoutBlock {
  return {
    id: crypto.randomUUID(),
    type,
    sort,
    isEnabled: true,
    options: blockDefaults(type),
  };
}

export function createEmptyLayoutJson(): LayoutJson {
  return {
    zones: {
      header: [],
      main: [],
      footer: [],
    },
  };
}

export function createDefaultLayoutJson(): LayoutJson {
  return {
    zones: {
      header: [
        createDefaultBlock("header", "logo", 1),
        createDefaultBlock("header", "navigation", 2),
      ],
      main: [
        createDefaultBlock("main", "banner", 1),
        createDefaultBlock("main", "section", 2),
      ],
      footer: [
        createDefaultBlock("footer", "footer_menu", 1),
        createDefaultBlock("footer", "copyright", 2),
      ],
    },
  };
}

export const DEFAULT_TENANT_ID = "11111111-1111-1111-1111-111111111111";