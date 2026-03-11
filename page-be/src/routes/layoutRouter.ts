import { Elysia, t } from "elysia";
import {
  createPageLayoutController,
  deletePageLayoutController,
  getPageLayoutByIdController,
  getPageLayoutsController,
  updatePageLayoutActiveController,
  updatePageLayoutController,
} from "@/controllers/layoutController";

export const pageLayoutRouter = new Elysia({ prefix: "/page-layouts" });

const layoutBlockSchema = t.Object({
  id: t.String(),
  type: t.String(),
  sort: t.Number(),
  isEnabled: t.Boolean(),
  options: t.Record(t.String(), t.Any()),
});

const layoutJsonSchema = t.Object({
  zones: t.Object({
    header: t.Array(layoutBlockSchema),
    main: t.Array(layoutBlockSchema),
    footer: t.Array(layoutBlockSchema),
  }),
});

pageLayoutRouter.get("/", getPageLayoutsController, {
  query: t.Object({
    tenantId: t.String(),
  }),
});

pageLayoutRouter.get("/:id", getPageLayoutByIdController, {
  params: t.Object({
    id: t.String(),
  }),
});

pageLayoutRouter.post("/", createPageLayoutController, {
  body: t.Object({
    tenantId: t.String(),
    name: t.String(),
    version: t.Number(),
    layoutType: t.Optional(t.Nullable(t.String())),
    layoutJson: layoutJsonSchema,
    cssBundlePath: t.Optional(t.Nullable(t.String())),
    isActive: t.Optional(t.Boolean()),
  }),
});

pageLayoutRouter.put("/:id", updatePageLayoutController, {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Object({
    name: t.String(),
    version: t.Number(),
    layoutType: t.Optional(t.Nullable(t.String())),
    layoutJson: layoutJsonSchema,
    cssBundlePath: t.Optional(t.Nullable(t.String())),
    isActive: t.Optional(t.Boolean()),
  }),
});

pageLayoutRouter.patch("/:id/active", updatePageLayoutActiveController, {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Object({
    isActive: t.Boolean(),
  }),
});

pageLayoutRouter.delete("/:id", deletePageLayoutController, {
  params: t.Object({
    id: t.String(),
  }),
});