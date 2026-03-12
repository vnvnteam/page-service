import { Elysia, t } from "elysia";
import {
  createPageLayoutController,
  deletePageLayoutController,
  getPageLayoutByIdController,
  getPageLayoutsController,
  updatePageLayoutActiveController,
  updatePageLayoutController,
} from "@/controllers/layoutController";

export const layoutRouter = new Elysia({ prefix: "/page-layouts" });

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

layoutRouter.get("/", getPageLayoutsController, {
  query: t.Object({
    tenantId: t.String(),
  }),
});

layoutRouter.get("/:id", getPageLayoutByIdController, {
  params: t.Object({
    id: t.String(),
  }),
});

layoutRouter.post("/", createPageLayoutController, {
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

layoutRouter.put("/:id", updatePageLayoutController, {
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

layoutRouter.patch("/:id/active", updatePageLayoutActiveController, {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Object({
    isActive: t.Boolean(),
  }),
});

layoutRouter.delete("/:id", deletePageLayoutController, {
  params: t.Object({
    id: t.String(),
  }),
});