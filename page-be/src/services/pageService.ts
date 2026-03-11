import { desc, eq, max } from "drizzle-orm";
import { db } from "@/db/db";
import { page, pageLayout } from "@/db/schema";

export interface CreatePageInput {
  tenantId: string;
  title?: string | null;
  desc?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  status?: string;
  pageLayoutId?: string | null;
  overrideJson?: Record<string, unknown>;
  cssBundlePath?: string | null;
}

export interface UpdatePageInput {
  title?: string | null;
  desc?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  status?: string;
  pageLayoutId?: string | null;
  overrideJson?: Record<string, unknown>;
  cssBundlePath?: string | null;
  syncLayoutToContent?: boolean;
}

function slugifyVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getNextPageNo(tenantId: string): Promise<number> {
  const result = await db
    .select({
      maxPageNo: max(page.pageNo),
    })
    .from(page)
    .where(eq(page.tenantId, tenantId));

  return Number(result[0]?.maxPageNo ?? 0) + 1;
}

async function generateUniqueSlug(
  tenantId: string,
  title?: string | null,
  excludeId?: string,
): Promise<string> {
  const baseSlug = slugifyVietnamese(title?.trim() || "page") || "page";

  const rows = await db
    .select({
      id: page.id,
      slug: page.slug,
    })
    .from(page)
    .where(eq(page.tenantId, tenantId));

  const usedSlugs = rows
    .filter((row) => (excludeId ? row.id !== excludeId : true))
    .map((row) => row.slug);

  if (!usedSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (usedSlugs.includes(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

async function getPageLayoutSnapshot(pageLayoutId?: string | null) {
  if (!pageLayoutId) {
    return {
      contentJson: {},
      pageLayoutVersion: null,
    };
  }

  const result = await db
    .select({
      layoutJson: pageLayout.layoutJson,
      version: pageLayout.version,
    })
    .from(pageLayout)
    .where(eq(pageLayout.id, pageLayoutId))
    .limit(1);

  const row = result[0];

  if (!row) {
    return {
      contentJson: {},
      pageLayoutVersion: null,
    };
  }

  return {
    contentJson: row.layoutJson ?? {},
    pageLayoutVersion: row.version ?? null,
  };
}

export const getPagesService = async (tenantId: string) => {
  return db
    .select()
    .from(page)
    .where(eq(page.tenantId, tenantId))
    .orderBy(desc(page.updatedAt));
};

export const getPageByIdService = async (id: string) => {
  const result = await db
    .select()
    .from(page)
    .where(eq(page.id, id))
    .limit(1);

  return result[0] ?? null;
};

export const createPageService = async (payload: CreatePageInput) => {
  const nextPageNo = await getNextPageNo(payload.tenantId);
  const nextSlug = await generateUniqueSlug(payload.tenantId, payload.title);

  const layoutSnapshot = await getPageLayoutSnapshot(payload.pageLayoutId);

  const result = await db
    .insert(page)
    .values({
      tenantId: payload.tenantId,
      pageNo: nextPageNo,
      slug: nextSlug,
      title: payload.title ?? null,
      desc: payload.desc ?? null,
      seoTitle: payload.seoTitle ?? null,
      seoDesc: payload.seoDesc ?? null,
      status: payload.status ?? "draft",
      pageLayoutId: payload.pageLayoutId ?? null,
      pageLayoutVersion: layoutSnapshot.pageLayoutVersion,
      contentJson: layoutSnapshot.contentJson,
      overrideJson: payload.overrideJson ?? {},
      cssBundlePath: payload.cssBundlePath ?? null,
    })
    .returning();

  return result[0];
};

export const updatePageService = async (id: string, payload: UpdatePageInput) => {
  const current = await getPageByIdService(id);
  if (!current) return null;

  const nextTitle = payload.title ?? current.title;
  const nextSlug =
    nextTitle !== current.title
      ? await generateUniqueSlug(current.tenantId, nextTitle, id)
      : current.slug;

  let nextContentJson = current.contentJson;
  let nextPageLayoutVersion = current.pageLayoutVersion;

  const layoutChanged =
    payload.pageLayoutId !== undefined && payload.pageLayoutId !== current.pageLayoutId;

  if (layoutChanged && payload.syncLayoutToContent) {
    const layoutSnapshot = await getPageLayoutSnapshot(payload.pageLayoutId);
    nextContentJson = layoutSnapshot.contentJson;
    nextPageLayoutVersion = layoutSnapshot.pageLayoutVersion;
  }

  const result = await db
    .update(page)
    .set({
      slug: nextSlug,
      title: nextTitle ?? null,
      desc: payload.desc ?? current.desc,
      seoTitle: payload.seoTitle ?? current.seoTitle,
      seoDesc: payload.seoDesc ?? current.seoDesc,
      status: payload.status ?? current.status,
      pageLayoutId:
        payload.pageLayoutId !== undefined ? payload.pageLayoutId : current.pageLayoutId,
      pageLayoutVersion: nextPageLayoutVersion,
      contentJson: nextContentJson,
      overrideJson: payload.overrideJson ?? current.overrideJson,
      cssBundlePath:
        payload.cssBundlePath !== undefined
          ? payload.cssBundlePath
          : current.cssBundlePath,
      updatedAt: new Date(),
    })
    .where(eq(page.id, id))
    .returning();

  return result[0] ?? null;
};

export const deletePageService = async (id: string) => {
  const result = await db
    .delete(page)
    .where(eq(page.id, id))
    .returning({
      id: page.id,
    });

  return result[0] ?? null;
};