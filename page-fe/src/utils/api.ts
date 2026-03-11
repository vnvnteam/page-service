/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LayoutJson, PageLayoutEntity } from "@/types/layout";

const API_BASE = "http://0.0.0.0:7225";

/* --LAYOUT-- */
export async function fetchPageLayouts(
  tenantId: string,
): Promise<PageLayoutEntity[]> {
  const response = await fetch(
    `${API_BASE}/page-layouts/?tenantId=${encodeURIComponent(tenantId)}`,
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách page layout");
  }

  return response.json();
}

export async function fetchPageLayoutById(
  id: string,
): Promise<PageLayoutEntity> {
  const response = await fetch(`${API_BASE}/page-layouts/${id}`);

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết page layout");
  }

  return response.json();
}

export async function createPageLayout(payload: {
  tenantId: string;
  name: string;
  version: number;
  layoutType?: string | null;
  layoutJson: LayoutJson;
  cssBundlePath?: string | null;
  isActive?: boolean;
}): Promise<PageLayoutEntity> {
  const response = await fetch(`${API_BASE}/page-layouts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await safeReadJson(response);
    throw new Error(errorBody?.message || "Không thể tạo page layout");
  }

  return response.json();
}

export async function updatePageLayout(
  id: string,
  payload: {
    name: string;
    version: number;
    layoutType?: string | null;
    layoutJson: LayoutJson;
    cssBundlePath?: string | null;
    isActive?: boolean;
  },
): Promise<PageLayoutEntity> {
  const response = await fetch(`${API_BASE}/page-layouts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await safeReadJson(response);
    throw new Error(errorBody?.message || "Không thể cập nhật page layout");
  }

  return response.json();
}

export async function deletePageLayout(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/page-layouts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorBody = await safeReadJson(response);
    throw new Error(errorBody?.message || "Không thể xóa page layout");
  }
}

export async function updatePageLayoutActive(
  id: string,
  isActive: boolean,
): Promise<PageLayoutEntity> {
  const response = await fetch(`${API_BASE}/page-layouts/${id}/active`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const errorBody = await safeReadJson(response);
    throw new Error(errorBody?.message || "Không thể cập nhật trạng thái active");
  }

  return response.json();
}

async function safeReadJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/* --PAGE-- */

export async function createPage(data: {
  tenantId: string;
  title?: string;
  desc?: string;
  seoTitle?: string;
  seoDesc?: string;
  status?: string;
  pageLayoutId?: string | null;
}) {
  const res = await fetch(`${API_BASE}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Create page failed");
  }

  return res.json();
}

export async function getPageLayouts(tenantId: string) {
  const res = await fetch(
    `${API_BASE}/page-layouts?tenantId=${tenantId}`
  );

  if (!res.ok) {
    throw new Error("Load page layouts failed");
  }

  return res.json();
}

/* --PAGE LIST-- */

export async function getPageById(id: string): Promise<PageDto> {
  const res = await fetch(`${API_BASE}/pages/${id}`);
  if (!res.ok) {
    throw new Error("Load page detail failed");
  }
  return res.json();
}

export async function updatePage(
  id: string,
  data: {
    title?: string | null;
    desc?: string | null;
    seoTitle?: string | null;
    seoDesc?: string | null;
    status?: string;
    pageLayoutId?: string | null;
    overrideJson?: Record<string, unknown>;
    cssBundlePath?: string | null;
    syncLayoutToContent?: boolean;
  },
): Promise<PageDto> {
  const res = await fetch(`${API_BASE}/pages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Update page failed");
  }

  return res.json();
}

export async function deletePage(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/pages/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete page failed");
  }
}