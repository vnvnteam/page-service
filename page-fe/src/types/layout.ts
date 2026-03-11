export type LayoutZone = "header" | "main" | "footer";

export type LayoutBlockType =
  | "logo"
  | "navigation"
  | "banner"
  | "section"
  | "footer_menu"
  | "copyright";

export interface LayoutBlock {
  id: string;
  type: LayoutBlockType;
  sort: number;
  isEnabled: boolean;
  options: Record<string, unknown>;
}

export interface LayoutJson {
  zones: {
    header: LayoutBlock[];
    main: LayoutBlock[];
    footer: LayoutBlock[];
  };
}

export interface PageLayoutEntity {
  id: string;
  tenantId: string;
  name: string;
  version: number;
  layoutType: string | null;
  layoutJson: LayoutJson;
  cssBundlePath: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageLayoutFormState {
  selectedId: string;
  tenantId: string;
  name: string;
  version: number;
  layoutType: string;
  isActive: boolean;
  cssBundlePath: string | null;
}

export interface SelectedBlockRef {
  zone: LayoutZone;
  blockId: string;
}