export type LayoutJson = {
  zones: {
    header: Array<{
      id: string;
      type: string;
      sort: number;
      isEnabled: boolean;
      options: unknown;
    }>;
    main: Array<{
      id: string;
      type: string;
      sort: number;
      isEnabled: boolean;
      options: unknown;
    }>;
    footer: Array<{
      id: string;
      type: string;
      sort: number;
      isEnabled: boolean;
      options: unknown;
    }>;
  };
};

export type CreatePageLayoutInput = {
  tenantId: string;
  name: string;
  version: number;
  layoutType?: string;
  layoutJson: LayoutJson;
  cssBundlePath?: string | null;
  isActive?: boolean;
};

export type UpdatePageLayoutInput = {
  name: string;
  version: number;
  layoutType?: string;
  layoutJson: LayoutJson;
  cssBundlePath?: string | null;
  isActive?: boolean;
};