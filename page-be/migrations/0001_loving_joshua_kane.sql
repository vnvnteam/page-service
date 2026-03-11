CREATE TABLE "css_asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255),
	"scope" varchar(50),
	"ref_id" uuid,
	"relative_path" text,
	"hash" varchar(64),
	"file_size" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "css_custom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"page_id" uuid NOT NULL,
	"css_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customizer_setting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"setting_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"css_bundle_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"page_no" integer,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255),
	"seo_title" varchar(255),
	"seo_desc" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"page_layout_id" uuid,
	"page_layout_version" integer,
	"content_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"override_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"css_bundle_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_layout" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"version" integer NOT NULL,
	"layout_type" varchar(100),
	"layout_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"css_bundle_path" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_layout_block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_layout_id" uuid NOT NULL,
	"zone" varchar(100),
	"sort" integer DEFAULT 0 NOT NULL,
	"block_type" varchar(100),
	"options_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"device" varchar(20) DEFAULT 'all' NOT NULL,
	"conditions_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "css_custom" ADD CONSTRAINT "css_custom_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_page_layout_id_page_layout_id_fk" FOREIGN KEY ("page_layout_id") REFERENCES "public"."page_layout"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "page_layout_block" ADD CONSTRAINT "page_layout_block_page_layout_id_page_layout_id_fk" FOREIGN KEY ("page_layout_id") REFERENCES "public"."page_layout"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_css_asset_tenant" ON "css_asset" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_css_asset_scope_ref" ON "css_asset" USING btree ("scope","ref_id");--> statement-breakpoint
CREATE INDEX "idx_css_asset_hash" ON "css_asset" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "idx_css_custom_tenant" ON "css_custom" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_css_custom_page" ON "css_custom" USING btree ("page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_customizer_setting_tenant" ON "customizer_setting" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_customizer_setting_tenant" ON "customizer_setting" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_page_tenant" ON "page" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_page_layout" ON "page" USING btree ("page_layout_id");--> statement-breakpoint
CREATE INDEX "idx_page_status" ON "page" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_page_layout_tenant_name_version" ON "page_layout" USING btree ("tenant_id","name","version");--> statement-breakpoint
CREATE INDEX "idx_page_layout_tenant" ON "page_layout" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_page_layout_active" ON "page_layout" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_layout_block_layout" ON "page_layout_block" USING btree ("page_layout_id");--> statement-breakpoint
CREATE INDEX "idx_layout_block_zone" ON "page_layout_block" USING btree ("zone");--> statement-breakpoint
CREATE INDEX "idx_layout_block_sort" ON "page_layout_block" USING btree ("sort");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_layout_block_sort_per_zone_device" ON "page_layout_block" USING btree ("page_layout_id","zone","device","sort");