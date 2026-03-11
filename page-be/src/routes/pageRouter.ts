import { Elysia, t } from "elysia";
import {
  createPageController,
  deletePageController,
  getPageByIdController,
  getPagesController,
  updatePageController,
} from "@/controllers/pageController";

export const pageRouter = new Elysia({ prefix: "/pages" });

pageRouter.get("/", getPagesController, {
  query: t.Object({
    tenantId: t.String(),
  }),
});

pageRouter.get("/:id", getPageByIdController, {
  params: t.Object({
    id: t.String(),
  }),
});

pageRouter.post("/", createPageController, {
  body: t.Object({
    tenantId: t.String(),
    title: t.Optional(t.Nullable(t.String())),
    desc: t.Optional(t.Nullable(t.String())),
    seoTitle: t.Optional(t.Nullable(t.String())),
    seoDesc: t.Optional(t.Nullable(t.String())),
    status: t.Optional(t.String()),
    pageLayoutId: t.Optional(t.Nullable(t.String())),
    overrideJson: t.Optional(t.Record(t.String(), t.Any())),
    cssBundlePath: t.Optional(t.Nullable(t.String())),
  }),
});

pageRouter.put("/:id", updatePageController, {
  params: t.Object({
    id: t.String(),
  }),
  body: t.Object({
    title: t.Optional(t.Nullable(t.String())),
    desc: t.Optional(t.Nullable(t.String())),
    seoTitle: t.Optional(t.Nullable(t.String())),
    seoDesc: t.Optional(t.Nullable(t.String())),
    status: t.Optional(t.String()),
    pageLayoutId: t.Optional(t.Nullable(t.String())),
    overrideJson: t.Optional(t.Record(t.String(), t.Any())),
    cssBundlePath: t.Optional(t.Nullable(t.String())),
    syncLayoutToContent: t.Optional(t.Boolean()),
  }),
});

pageRouter.delete("/:id", deletePageController, {
  params: t.Object({
    id: t.String(),
  }),
});