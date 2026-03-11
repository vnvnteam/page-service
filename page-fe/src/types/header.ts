/* eslint-disable @typescript-eslint/no-explicit-any */
export type HeaderItem = {
  id: string;
  type: string;
  label: string;
  props?: Record<string, any>;
};

export type SlotKey = "left" | "center" | "right";
export type RowKey = "top" | "main" | "bottom";

export type HeaderRow = Record<SlotKey, HeaderItem[]>;
export type HeaderLayout = Record<RowKey, HeaderRow>;

export type HeaderConfig = {
  layout: HeaderLayout;
  notInUse: HeaderItem[];
};

const makeRow = (): HeaderRow => ({ left: [], center: [], right: [] });

export const DEFAULT_ITEMS: HeaderItem[] = [
  { id: "nav-icon", type: "nav-icon", label: "Nav Icon", props: { visible: true } },
  { id: "top-bar-menu", type: "top-bar-menu", label: "Top Bar Menu", props: { visible: true } },
  { id: "search-icon", type: "search-icon", label: "Search Icon", props: { visible: true } },
  { id: "vertical-menu", type: "vertical-menu", label: "Vertical Menu", props: { visible: true } },
  { id: "search-form", type: "search-form", label: "Search Form", props: { visible: true, placeholder: "Tìm kiếm..." } },
  { id: "social-icons", type: "social-icons", label: "Social Icons", props: { visible: true } },
  { id: "contact", type: "contact", label: "Contact", props: { visible: true } },
  { id: "button-1", type: "button-1", label: "Button 1", props: { visible: true, text: "Button 1", href: "#" } },
  { id: "button-2", type: "button-2", label: "Button 2", props: { visible: true, text: "Button 2", href: "#" } },
  { id: "checkout-button", type: "checkout-button", label: "Checkout Button", props: { visible: true } },
  { id: "newsletter", type: "newsletter", label: "Newsletter", props: { visible: true } },
  { id: "languages", type: "languages", label: "Languages", props: { visible: true } },
  { id: "block-1", type: "block-1", label: "Block 1", props: { visible: true } },
  { id: "block-2", type: "block-2", label: "Block 2", props: { visible: true } },
  { id: "html-1", type: "html-1", label: "HTML 1", props: { visible: true, html: "<b>HTML 1</b>" } },
  { id: "html-2", type: "html-2", label: "HTML 2", props: { visible: true, html: "<b>HTML 2</b>" } },
  { id: "html-3", type: "html-3", label: "HTML 3", props: { visible: true, html: "<b>HTML 3</b>" } },
  { id: "html-4", type: "html-4", label: "HTML 4", props: { visible: true, html: "<b>HTML 4</b>" } },
  { id: "html-5", type: "html-5", label: "HTML 5", props: { visible: true, html: "<b>HTML 5</b>" } },
  { id: "main-menu", type: "main-menu", label: "Main Menu", props: { visible: true } },
  { id: "account", type: "account", label: "Account", props: { visible: true } },
  { id: "cart", type: "cart", label: "Cart", props: { visible: true } },
];

function newLogo(): HeaderItem {
  return { id: "logo", type: "logo", label: "LOGO", props: { visible: true } };
}

export function makeDefaultHeaderConfig(): HeaderConfig {
  return {
    layout: {
      top: makeRow(),
      main: { ...makeRow(), left: [newLogo()] }, // logo mặc định
      bottom: makeRow(),
    },
    notInUse: structuredClone(DEFAULT_ITEMS),
  };
}

// helper: tìm item theo id trong layout/notInUse
export function findItem(cfg: HeaderConfig, itemId: string): HeaderItem | null {
  for (const row of ["top", "main", "bottom"] as RowKey[]) {
    for (const col of ["left", "center", "right"] as SlotKey[]) {
      const found = cfg.layout[row][col].find((x) => x.id === itemId);
      if (found) return found;
    }
  }
  return cfg.notInUse.find((x) => x.id === itemId) ?? null;
}

export type HeaderItemSchemaField =
  | { key: "visible"; label: string; type: "boolean" }
  | { key: "text"; label: string; type: "text" }
  | { key: "href"; label: string; type: "text" }
  | { key: "placeholder"; label: string; type: "text" }
  | { key: "html"; label: string; type: "text" };

export type HeaderItemSchema = { title: string; fields: HeaderItemSchemaField[] };

export const headerItemSchemas: Record<string, HeaderItemSchema> = {
  "search-form": {
    title: "Search Form",
    fields: [
      { key: "visible", label: "Hiển thị", type: "boolean" },
      { key: "placeholder", label: "Placeholder", type: "text" },
    ],
  },
  "button-1": {
    title: "Button 1",
    fields: [
      { key: "visible", label: "Hiển thị", type: "boolean" },
      { key: "text", label: "Text", type: "text" },
      { key: "href", label: "Link", type: "text" },
    ],
  },
  "button-2": {
    title: "Button 2",
    fields: [
      { key: "visible", label: "Hiển thị", type: "boolean" },
      { key: "text", label: "Text", type: "text" },
      { key: "href", label: "Link", type: "text" },
    ],
  },
  "html-1": { title: "HTML 1", fields: [{ key: "visible", label: "Hiển thị", type: "boolean" }, { key: "html", label: "HTML", type: "text" }] },
  "html-2": { title: "HTML 2", fields: [{ key: "visible", label: "Hiển thị", type: "boolean" }, { key: "html", label: "HTML", type: "text" }] },
  "html-3": { title: "HTML 3", fields: [{ key: "visible", label: "Hiển thị", type: "boolean" }, { key: "html", label: "HTML", type: "text" }] },
  "html-4": { title: "HTML 4", fields: [{ key: "visible", label: "Hiển thị", type: "boolean" }, { key: "html", label: "HTML", type: "text" }] },
  "html-5": { title: "HTML 5", fields: [{ key: "visible", label: "Hiển thị", type: "boolean" }, { key: "html", label: "HTML", type: "text" }] },
};