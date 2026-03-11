/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

export const adminPanels: Record<string, React.LazyExoticComponent<any>> = {
  // ===== Products =====
  "products.all": lazy(() => import("@/pages/admin/blankPage")),
  "products.new": lazy(() => import("@/pages/admin/blankPage")),
  "products.categories": lazy(() => import("@/pages/admin/blankPage")),
  "products.tag": lazy(() => import("@/pages/admin/blankPage")),

  // ===== Pages =====
  "pages.list": lazy(() => import("@/pages/page/pageList")),
  "pages.new": lazy(() => import("@/pages/page/pageNew")),
  
  // ===== Appearance =====
  "appearance": lazy(() => import("@/pages/layout/pageLayout")),
};

export type PanelKey = keyof typeof adminPanels;
