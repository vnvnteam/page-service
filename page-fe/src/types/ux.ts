/* eslint-disable @typescript-eslint/no-explicit-any */
export type UXZone = "header" | "main" | "footer";

export type UXBlockType =
  | "logo"
  | "navigation"
  | "banner"
  | "section"
  | "footer_menu"
  | "copyright";

export type UXBlock = {
  id: string;
  type: UXBlockType;
  props: Record<string, any>;
};

export type UXContentJson = {
  header: UXBlock[];
  main: UXBlock[];
  footer: UXBlock[];
};

export type SelectedBlockRef = {
  zone: UXZone;
  blockId: string;
} | null;

export type BlockFieldType = "text" | "textarea" | "number" | "select" | "image";

export type BlockField = {
  key: string;
  label: string;
  type: BlockFieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export type BlockDefinition = {
  type: UXBlockType;
  label: string;
  zone: UXZone;
  description: string;
  defaultProps: Record<string, any>;
  fields: BlockField[];
};