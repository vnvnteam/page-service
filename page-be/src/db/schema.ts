import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  boolean,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pageLayout = pgTable(
  "page_layout",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    version: integer("version").notNull(),

    layoutType: varchar("layout_type", { length: 100 }),
    layoutJson: jsonb("layout_json")
      .notNull()
      .default(sql`'{}'::jsonb`),

    cssBundlePath: text("css_bundle_path"),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uqTenantNameVersion: uniqueIndex("uq_page_layout_tenant_name_version").on(
      t.tenantId,
      t.name,
      t.version,
    ),
    idxTenant: index("idx_page_layout_tenant").on(t.tenantId),
    idxActive: index("idx_page_layout_active").on(t.isActive),
  }),
);

export const page = pgTable(
  "page",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),

    pageNo: integer("page_no"),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }),
    desc: text("desc"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDesc: text("seo_desc"),

    status: varchar("status", { length: 50 }).notNull().default("draft"),

    pageLayoutId: uuid("page_layout_id").references(() => pageLayout.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    pageLayoutVersion: integer("page_layout_version"),

    contentJson: jsonb("content_json")
      .notNull()
      .default(sql`'{}'::jsonb`),
    overrideJson: jsonb("override_json")
      .notNull()
      .default(sql`'{}'::jsonb`),

    cssBundlePath: text("css_bundle_path"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    idxTenant: index("idx_page_tenant").on(t.tenantId),
    idxLayout: index("idx_page_layout").on(t.pageLayoutId),
    idxStatus: index("idx_page_status").on(t.status),
  }),
);

export const pageLayoutBlock = pgTable(
  "page_layout_block",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pageLayoutId: uuid("page_layout_id")
      .notNull()
      .references(() => pageLayout.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    zone: varchar("zone", { length: 100 }),
    sort: integer("sort").notNull().default(0),

    blockType: varchar("block_type", { length: 100 }),

    optionsJson: jsonb("options_json")
      .notNull()
      .default(sql`'{}'::jsonb`),

    device: varchar("device", { length: 20 }).notNull().default("all"),

    conditionsJson: jsonb("conditions_json")
      .notNull()
      .default(sql`'{}'::jsonb`),

    isEnabled: boolean("is_enabled").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    idxLayout: index("idx_layout_block_layout").on(t.pageLayoutId),
    idxZone: index("idx_layout_block_zone").on(t.zone),
    idxSort: index("idx_layout_block_sort").on(t.sort),
    uqSortPerZone: uniqueIndex("uq_layout_block_sort_per_zone_device").on(
      t.pageLayoutId,
      t.zone,
      t.device,
      t.sort,
    ),
  }),
);

export const cssAsset = pgTable(
  "css_asset",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),

    name: varchar("name", { length: 255 }),
    scope: varchar("scope", { length: 50 }),

    refId: uuid("ref_id"),

    relativePath: text("relative_path"),
    hash: varchar("hash", { length: 64 }),
    fileSize: integer("file_size"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    idxTenant: index("idx_css_asset_tenant").on(t.tenantId),
    idxScopeRef: index("idx_css_asset_scope_ref").on(t.scope, t.refId),
    idxHash: index("idx_css_asset_hash").on(t.hash),
  }),
);

export const cssCustom = pgTable(
  "css_custom",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),

    pageId: uuid("page_id")
      .notNull()
      .references(() => page.id, { onDelete: "cascade", onUpdate: "cascade" }),

    cssText: text("css_text"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    idxTenant: index("idx_css_custom_tenant").on(t.tenantId),
    idxPage: index("idx_css_custom_page").on(t.pageId),
  }),
);
export const customizerSetting = pgTable(
  "customizer_setting",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),

    settingJson: jsonb("setting_json")
      .notNull()
      .default(sql`'{}'::jsonb`),

    cssBundlePath: text("css_bundle_path"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uqTenant: uniqueIndex("uq_customizer_setting_tenant").on(t.tenantId),
    idxTenant: index("idx_customizer_setting_tenant").on(t.tenantId),
  }),
);
