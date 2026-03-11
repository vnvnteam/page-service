/* eslint-disable @typescript-eslint/no-explicit-any */
export type UUID = string;

export type LayoutNode = {
  id: UUID;                 // node id (uuid)
  blockKey: string;         // "section" | "heading" | ...
  version: number;          // block version
  props: Record<string, any>;
  children?: LayoutNode[];
};

export type PageDoc = {
  id: UUID;
  prefix: string;
  title: string;
  slug: string;
  layout_json: LayoutNode[]; // root is array
  updated_at?: string;
};

export type BlockDefinition = {
  id: UUID;
  block_key: string;
  version: number;
  name: string;
  category?: string;
  props_schema: PropsSchema;
  is_active: boolean;
};

export type PropsSchema = {
  schemaVersion?: number;
  display?: { icon?: string; help?: string };
  defaults?: Record<string, any>;
  props: Record<string, PropField>;
};

export type PropField =
  | {
      type: "string";
      label: string;
      ui: "input" | "textarea" | "color" | "select" | "segmented";
      required?: boolean;
      maxLength?: number;
      options?: Array<{ label: string; value: any }> | any[];
    }
  | {
      type: "number";
      label: string;
      ui: "input" | "slider" | "select";
      required?: boolean;
      min?: number;
      max?: number;
      step?: number;
      options?: Array<{ label: string; value: number }>;
    }
  | {
      type: "boolean";
      label: string;
      ui: "switch";
      required?: boolean;
    }
  | {
      type: "ref";
      label: string;
      ui: "contentPicker";
      required?: boolean;
      ref: { table: string; valueField: string; labelField: string };
    };

