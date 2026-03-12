import type { PanelKey } from "@/pages/admin/panel";

export type MenuAction =
  | { type: "panel"; panel: PanelKey }                 
  | { type: "navigate"; to: string; replace?: boolean } 
  | { type: "external"; href: string; newTab?: boolean }; 

export type AdminChild = { key: string; label: string; action: MenuAction };

export type AdminMenuItem = {
  key: string;
  label: string;
  icon?: string;
  action?: MenuAction;
  children?: AdminChild[];
};

export const adminMenu: AdminMenuItem[] = [
    { key: "pages", label: "Trang", icon: "🎨", action: { type: "panel", panel: "pages.list" } },

  {
    key: "products",
    label: "Sản phẩm",
    icon: "🛒",
    children: [
      { key: "products.all", label: "Tất cả sản phẩm", action: { type: "panel", panel: "products.all" } },
      { key: "products.new", label: "Thêm sản phẩm mới", action: { type: "panel", panel: "products.new" } },
      { key: "products.categories", label: "Danh mục", action: { type: "panel", panel: "products.categories" } },
      { key: "products.tags", label: "Thẻ", action: { type: "panel", panel: "products.tags" } },
      { key: "products.attributes", label: "Các thuộc tính", action: { type: "panel", panel: "products.attributes" } },
      { key: "products.reviews", label: "Đánh giá",  action: { type: "external", href: "https://example.com/docs", newTab: true } },
    ],
  },
  { key: "appearance", label: "Giao diện", icon: "🎨", action: { type: "panel", panel: "appearance" } },
  { key: "plugins", label: "Plugin", icon: "🧩" },
  { key: "users", label: "Thành viên", icon: "👤" },
  { key: "media", label: "Media", icon: " 🛠️" },
  { key: "settings", label: "Cài đặt", icon: "⚙️" },
];