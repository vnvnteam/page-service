/* eslint-disable @typescript-eslint/no-explicit-any */
export type UUID = string;

export type PropField =
  | { type: "string"; label: string; ui: "input" | "textarea" | "color" | "select"; options?: any[] }
  | { type: "number"; label: string; ui: "input" | "select"; min?: number; max?: number; step?: number; options?: any[] }
  | { type: "boolean"; label: string; ui: "switch" }
  | { type: "ref"; label: string; ui: "contentPicker"; ref: { table: string; valueField: string; labelField: string } };

export type PropsSchema = {
  display?: { help?: string };
  defaults?: Record<string, any>;
  props: Record<string, PropField>;
};

export type BlockDefinition = {
  id: UUID;
  block_key: string;
  version: number;
  name: string;
  category?: string;
  is_active: boolean;
  props_schema: PropsSchema;
};

const id = () => crypto.randomUUID();

export const BLOCK_CATALOG: BlockDefinition[] = [
  // ===== Text =====
  {
    id: id(),
    block_key: "paragraph",
    version: 1,
    name: "Paragraph",
    category: "text",
    is_active: true,
    props_schema: {
      display: { help: "Đoạn văn bản" },
      defaults: { text: "Lorem ipsum..." },
      props: { text: { type: "string", label: "Text", ui: "textarea" } },
    },
  },
  {
    id: id(),
    block_key: "heading",
    version: 1,
    name: "Heading",
    category: "text",
    is_active: true,
    props_schema: {
      display: { help: "Tiêu đề H1-H6" },
      defaults: { level: 2, text: "Heading", align: "left" },
      props: {
        text: { type: "string", label: "Text", ui: "textarea" },
        level: {
          type: "number",
          label: "Level",
          ui: "select",
          options: [
            { label: "H1", value: 1 }, { label: "H2", value: 2 }, { label: "H3", value: 3 },
            { label: "H4", value: 4 }, { label: "H5", value: 5 }, { label: "H6", value: 6 },
          ],
        },
        align: {
          type: "string",
          label: "Align",
          ui: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
    },
  },
  {
    id: id(),
    block_key: "list",
    version: 1,
    name: "List",
    category: "text",
    is_active: true,
    props_schema: {
      display: { help: "Danh sách (mỗi dòng 1 item)" },
      defaults: { itemsText: "Item 1\nItem 2\nItem 3", ordered: false },
      props: {
        itemsText: { type: "string", label: "Items (one per line)", ui: "textarea" },
        ordered: { type: "boolean", label: "Ordered list", ui: "switch" },
      },
    },
  },

  // ===== Data =====
  {
    id: id(),
    block_key: "table",
    version: 1,
    name: "Table",
    category: "data",
    is_active: true,
    props_schema: {
      display: { help: "Bảng đơn giản (CSV mini)" },
      defaults: { csv: "Name,Price\nPho,50000\nBun,45000" },
      props: { csv: { type: "string", label: "CSV", ui: "textarea" } },
    },
  },

  // ===== Media =====
  {
    id: id(),
    block_key: "image",
    version: 1,
    name: "Image",
    category: "media",
    is_active: true,
    props_schema: {
      display: { help: "Ảnh theo URL" },
      defaults: { src: "https://placehold.co/1000x500", alt: "", radius: 10 },
      props: {
        src: { type: "string", label: "Src", ui: "input" },
        alt: { type: "string", label: "Alt", ui: "input" },
        radius: { type: "number", label: "Radius", ui: "input", min: 0, max: 50, step: 1 },
      },
    },
  },
  {
    id: id(),
    block_key: "gallery",
    version: 1,
    name: "Gallery",
    category: "media",
    is_active: true,
    props_schema: {
      display: { help: "Danh sách ảnh (mỗi dòng 1 URL)" },
      defaults: { imagesText: "https://placehold.co/600x400\nhttps://placehold.co/600x401", cols: 3 },
      props: {
        imagesText: { type: "string", label: "Image URLs (one per line)", ui: "textarea" },
        cols: { type: "number", label: "Columns", ui: "input", min: 1, max: 6, step: 1 },
      },
    },
  },
  {
    id: id(),
    block_key: "video",
    version: 1,
    name: "Video",
    category: "media",
    is_active: true,
    props_schema: {
      display: { help: "Video embed (URL)" },
      defaults: { url: "", aspect: "16:9" },
      props: {
        url: { type: "string", label: "Video URL", ui: "input" },
        aspect: {
          type: "string",
          label: "Aspect",
          ui: "select",
          options: [{ label: "16:9", value: "16:9" }, { label: "4:3", value: "4:3" }],
        },
      },
    },
  },
  {
    id: id(),
    block_key: "audio",
    version: 1,
    name: "Audio",
    category: "media",
    is_active: true,
    props_schema: {
      display: { help: "Audio (URL)" },
      defaults: { url: "" },
      props: { url: { type: "string", label: "Audio URL", ui: "input" } },
    },
  },
  {
    id: id(),
    block_key: "file",
    version: 1,
    name: "File",
    category: "media",
    is_active: true,
    props_schema: {
      display: { help: "File link (URL + label)" },
      defaults: { url: "", label: "Download" },
      props: {
        url: { type: "string", label: "File URL", ui: "input" },
        label: { type: "string", label: "Label", ui: "input" },
      },
    },
  },

  // ===== Actions =====
  {
    id: id(),
    block_key: "button",
    version: 1,
    name: "Button",
    category: "actions",
    is_active: true,
    props_schema: {
      display: { help: "Nút hành động" },
      defaults: { text: "Click", href: "#", variant: "default" },
      props: {
        text: { type: "string", label: "Text", ui: "input" },
        href: { type: "string", label: "Href", ui: "input" },
        variant: {
          type: "string",
          label: "Variant",
          ui: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Destructive", value: "destructive" },
          ],
        },
      },
    },
  },
  {
    id: id(),
    block_key: "more",
    version: 1,
    name: "More",
    category: "actions",
    is_active: true,
    props_schema: {
      display: { help: "Nút/Link 'More' đơn giản" },
      defaults: { text: "More", href: "#" },
      props: {
        text: { type: "string", label: "Text", ui: "input" },
        href: { type: "string", label: "Href", ui: "input" },
      },
    },
  },

  // ===== Layout helpers =====
  {
    id: id(),
    block_key: "line",
    version: 1,
    name: "Line",
    category: "layout",
    is_active: true,
    props_schema: {
      display: { help: "Divider line" },
      defaults: { height: 1 },
      props: {
        height: { type: "number", label: "Height", ui: "input", min: 1, max: 10, step: 1 },
      },
    },
  },

  // ===== Navigation/UI (placeholder configs) =====
  {
  id: id(),
  block_key: "header",
  version: 1,
  name: "Header",
  category: "global",
  is_active: true,
  props_schema: {
    display: { help: "Header global (click trong Structure để mở Header Builder)" },
    defaults: {
      templateId: null,       // sau này bạn dùng header_templates
      sticky: false,
    },
    props: {
      templateId: {
        type: "ref",
        label: "Header Template",
        ui: "contentPicker",
        ref: { table: "layout_templates", valueField: "id", labelField: "name" },
      },
      sticky: { type: "boolean", label: "Sticky", ui: "switch" },
    },
  },
},
  {
    id: id(),
    block_key: "navigation",
    version: 1,
    name: "Navigation",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Menu điều hướng (v1: placeholder)" },
      defaults: { source: "static", itemsText: "Home:/\nAbout:/about" },
      props: {
        source: { type: "string", label: "Source", ui: "select", options: [{ label: "Static", value: "static" }] },
        itemsText: { type: "string", label: "Items (label:url per line)", ui: "textarea" },
      },
    },
  },
  {
    id: id(),
    block_key: "menu",
    version: 1,
    name: "Menu",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Menu (v1: placeholder)" },
      defaults: { title: "Menu", source: "static" },
      props: {
        title: { type: "string", label: "Title", ui: "input" },
        source: { type: "string", label: "Source", ui: "select", options: [{ label: "Static", value: "static" }] },
      },
    },
  },
  {
    id: id(),
    block_key: "search",
    version: 1,
    name: "Search",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Search box (v1: placeholder)" },
      defaults: { placeholder: "Search...", target: "/search" },
      props: {
        placeholder: { type: "string", label: "Placeholder", ui: "input" },
        target: { type: "string", label: "Target URL", ui: "input" },
      },
    },
  },
  {
    id: id(),
    block_key: "calendar",
    version: 1,
    name: "Calendar",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Calendar (v1: placeholder config)" },
      defaults: { provider: "google", view: "month" },
      props: {
        provider: {
          type: "string",
          label: "Provider",
          ui: "select",
          options: [{ label: "Google", value: "google" }, { label: "Outlook", value: "outlook" }],
        },
        view: {
          type: "string",
          label: "View",
          ui: "select",
          options: [{ label: "Month", value: "month" }, { label: "Week", value: "week" }, { label: "Day", value: "day" }],
        },
      },
    },
  },
  {
    id: id(),
    block_key: "auth",
    version: 1,
    name: "Login/Logout",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Auth widget (v1: placeholder)" },
      defaults: { mode: "login", redirectTo: "/" },
      props: {
        mode: { type: "string", label: "Mode", ui: "select", options: [{ label: "Login", value: "login" }, { label: "Logout", value: "logout" }] },
        redirectTo: { type: "string", label: "Redirect to", ui: "input" },
      },
    },
  },
  {
    id: id(),
    block_key: "cart",
    version: 1,
    name: "Cart",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Cart widget (v1: placeholder)" },
      defaults: { showTotal: true },
      props: {
        showTotal: { type: "boolean", label: "Show total", ui: "switch" },
      },
    },
  },
  {
    id: id(),
    block_key: "pagination",
    version: 1,
    name: "Pagination",
    category: "ui",
    is_active: true,
    props_schema: {
      display: { help: "Pagination (v1: placeholder)" },
      defaults: { page: 1, pageSize: 10 },
      props: {
        page: { type: "number", label: "Page", ui: "input", min: 1, max: 9999, step: 1 },
        pageSize: { type: "number", label: "Page size", ui: "input", min: 1, max: 100, step: 1 },
      },
    },
  },
];
