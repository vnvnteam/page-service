/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

export const adminPanels: Record<string, React.LazyExoticComponent<any>> = {
  // ===== Products =====
  "products.all": lazy(() => import("@/pages/admin/blankPage")),
  "products.new": lazy(() => import("@/pages/admin/blankPage")),
  "products.categories": lazy(() => import("@/pages/admin/blankPage")),
  "products.tag": lazy(() => import("@/pages/admin/blankPage")),

  // ===== Pages =====
  "pages.list": lazy(() => import("@/pages/page/listPage")),
  "pages.new": lazy(() => import("@/pages/page/newPage")),
  "pages.info": lazy(() => import("@/pages/page/infoPage")),
  
  // ===== Appearance =====
  "appearance": lazy(() => import("@/pages/layout/pageLayout")),
};

export type PanelKey = keyof typeof adminPanels;
