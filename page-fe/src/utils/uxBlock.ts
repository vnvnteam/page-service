import type { BlockDefinition, UXBlockType } from "@/types/ux";

export const BLOCK_REGISTRY: Record<UXBlockType, BlockDefinition> = {
  logo: {
    type: "logo",
    label: "Logo",
    zone: "header",
    description: "Hiển thị logo ở đầu trang",
    defaultProps: {
      text: "VN CMS 3.0",
      image: "",
      width: 120,
    },
    fields: [
      { key: "text", label: "Tên logo", type: "text", placeholder: "VN CMS 3.0" },
      { key: "image", label: "Đường dẫn ảnh", type: "image", placeholder: "/logo.png" },
      { key: "width", label: "Chiều rộng", type: "number" },
    ],
  },

  navigation: {
    type: "navigation",
    label: "Navigation",
    zone: "header",
    description: "Menu điều hướng",
    defaultProps: {
      menuName: "main-menu",
      itemsText: "Trang chủ, Giới thiệu, Liên hệ",
      align: "right",
    },
    fields: [
      { key: "menuName", label: "Tên menu", type: "text", placeholder: "main-menu" },
      {
        key: "itemsText",
        label: "Danh sách item",
        type: "textarea",
        placeholder: "Trang chủ, Giới thiệu, Liên hệ",
      },
      {
        key: "align",
        label: "Canh lề",
        type: "select",
        options: [
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
    ],
  },

  banner: {
    type: "banner",
    label: "Banner",
    zone: "main",
    description: "Banner lớn ở phần thân trang",
    defaultProps: {
      title: "Welcome to VN CMS",
      subtitle: "Banner demo cho UX Builder",
      buttonText: "Xem thêm",
      image: "",
      height: 280,
    },
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", placeholder: "Welcome to VN CMS" },
      { key: "subtitle", label: "Mô tả", type: "textarea", placeholder: "Banner demo..." },
      { key: "buttonText", label: "Text nút", type: "text", placeholder: "Xem thêm" },
      { key: "image", label: "Ảnh nền", type: "image", placeholder: "/banner.jpg" },
      { key: "height", label: "Chiều cao", type: "number" },
    ],
  },

  section: {
    type: "section",
    label: "Section",
    zone: "main",
    description: "Khối nội dung cơ bản",
    defaultProps: {
      title: "Section title",
      description: "Section description",
      columns: 2,
      gap: 16,
    },
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", placeholder: "Section title" },
      { key: "description", label: "Mô tả", type: "textarea", placeholder: "Section description" },
      { key: "columns", label: "Số cột", type: "number" },
      { key: "gap", label: "Khoảng cách", type: "number" },
    ],
  },

  footer_menu: {
    type: "footer_menu",
    label: "Footer Menu",
    zone: "footer",
    description: "Menu cuối trang",
    defaultProps: {
      menuName: "footer-menu",
      itemsText: "Chính sách, Điều khoản, Hỗ trợ",
    },
    fields: [
      { key: "menuName", label: "Tên menu", type: "text", placeholder: "footer-menu" },
      {
        key: "itemsText",
        label: "Danh sách item",
        type: "textarea",
        placeholder: "Chính sách, Điều khoản, Hỗ trợ",
      },
    ],
  },

  copyright: {
    type: "copyright",
    label: "Copyright",
    zone: "footer",
    description: "Dòng bản quyền",
    defaultProps: {
      text: "© 2026 VN CMS",
    },
    fields: [
      { key: "text", label: "Nội dung", type: "text", placeholder: "© 2026 VN CMS" },
    ],
  },
};