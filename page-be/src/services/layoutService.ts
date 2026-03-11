import { desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { pageLayout } from "@/db/schema";
import { CreatePageLayoutInput, UpdatePageLayoutInput } from "@/types/types";

export const getPageLayoutsService = async (tenantId: string) => {
  return db
    .select()
    .from(pageLayout)
    .where(eq(pageLayout.tenantId, tenantId))
    .orderBy(desc(pageLayout.updatedAt));
};

export const getPageLayoutByIdService = async (id: string) => {
  const result = await db
    .select()
    .from(pageLayout)
    .where(eq(pageLayout.id, id))
    .limit(1);

  return result[0] ?? null;
};

export const createPageLayoutService = async (payload: CreatePageLayoutInput) => {
  const result = await db
    .insert(pageLayout)
    .values({
      tenantId: payload.tenantId,
      name: payload.name,
      version: payload.version,
      layoutType: payload.layoutType ?? "default",
      layoutJson: payload.layoutJson,
      cssBundlePath: payload.cssBundlePath ?? null,
      isActive: payload.isActive ?? true,
    })
    .returning();

  return result[0];
};

export const updatePageLayoutService = async (
  id: string,
  payload: UpdatePageLayoutInput,
) => {
  const result = await db
    .update(pageLayout)
    .set({
      name: payload.name,
      version: payload.version,
      layoutType: payload.layoutType ?? "default",
      layoutJson: payload.layoutJson,
      cssBundlePath: payload.cssBundlePath ?? null,
      isActive: payload.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(pageLayout.id, id))
    .returning();

  return result[0] ?? null;
};

export const deletePageLayoutService = async (id: string) => {
  const result = await db
    .delete(pageLayout)
    .where(eq(pageLayout.id, id))
    .returning({
      id: pageLayout.id,
    });

  return result[0] ?? null;
};

export const updatePageLayoutActiveService = async (
  id: string,
  isActive: boolean,
) => {
  const result = await db
    .update(pageLayout)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(pageLayout.id, id))
    .returning();

  return result[0] ?? null;
};