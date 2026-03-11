import { Suspense, useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { adminMenu, AdminMenuItem, MenuAction } from "@/utils/menu";
import AdminBlankPage from "@/pages/admin/blankPage";
import AdminShell from "@/pages/admin/adminHeader";
import { adminPanels } from "@/pages/admin/panel";

import { AdminNavProvider } from "@/pages/builder/navProvider";

function cx(...s: Array<string | false | undefined | null>) {
  return s.filter(Boolean).join(" ");
}

const STORAGE_ACTIVE_PANEL = "admin.activePanel.v1";
const STORAGE_EXPANDED_KEY = "admin.expandedKey.v1";

function isPanelAction(a?: MenuAction): a is { type: "panel"; panel: string } {
  return !!a && a.type === "panel";
}

function getTopKeyForActivePanel(panel: string): string | null {
  for (const m of adminMenu) {
    if (isPanelAction(m.action) && m.action.panel === panel) return m.key;
    if (m.children?.some((c) => isPanelAction(c.action) && c.action.panel === panel)) return m.key;
  }
  return null;
}

export default function AdminPage() {
  const navigate = useNavigate();

  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const [panelStack, setPanelStack] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_ACTIVE_PANEL);
    return [saved || "pages.list"];
  });

  const activePanel = panelStack[panelStack.length - 1];

  const [expandedKey, setExpandedKey] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_EXPANDED_KEY) || getTopKeyForActivePanel(activePanel);
  });

  const activeTopKey = useMemo(() => getTopKeyForActivePanel(activePanel), [activePanel]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVE_PANEL, activePanel);
  }, [activePanel]);

  useEffect(() => {
    if (expandedKey) localStorage.setItem(STORAGE_EXPANDED_KEY, expandedKey);
  }, [expandedKey]);

  const openPanel = (key: string) => {
    setPanelStack((prev) => (prev[prev.length - 1] === key ? prev : [...prev, key]));
  };

  const goBack = () => {
    setPanelStack((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  };

  const runAction = (action: MenuAction) => {
    if (action.type === "panel") {
      setPanelStack([action.panel]);
      return;
    }
    if (action.type === "navigate") {
      navigate(action.to, { replace: !!action.replace });
      return;
    }
    if (action.type === "external") {
      if (action.newTab ?? true) window.open(action.href, "_blank", "noopener,noreferrer");
      else window.location.href = action.href;
    }
  };

  const onClickTop = (m: AdminMenuItem) => {
    const hasChildren = !!m.children?.length;
    if (hasChildren) {
      setExpandedKey((prev) => (prev === m.key ? null : m.key));
      return;
    }
    if (m.action) runAction(m.action);
  };

  const sidebar = (
    <div className="h-full bg-[#1d2327] text-white/90 border-r border-black/30">
      <div className="h-14 px-4 flex items-center gap-2 border-b border-white/10">
        <div className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">CMS</div>
        <div className="font-semibold">Admin</div>
      </div>

      <div className="relative h-[calc(100%-3.5rem)] overflow-auto py-2">
        {adminMenu.map((m) => {
          const hasChildren = !!m.children?.length;
          const isExpanded = expandedKey === m.key;
          const isActiveTop = activeTopKey === m.key;

          return (
            <div
              key={m.key}
              className="relative"
              onMouseEnter={() => setHoverKey(m.key)}
              onMouseLeave={() => setHoverKey((prev) => (prev === m.key ? null : prev))}
            >
              <button
                type="button"
                onClick={() => onClickTop(m)}
                className={cx(
                  "w-full text-left px-4 py-2 flex items-center gap-3",
                  "hover:bg-white/10 transition",
                  isActiveTop && "bg-white/10"
                )}
              >
                <span className="w-6 text-lg leading-none">{m.icon ?? "•"}</span>
                <span className="flex-1">{m.label}</span>
                {hasChildren ? <span className="text-white/60">{isExpanded ? "▾" : "▸"}</span> : null}
              </button>

              {hasChildren && isExpanded && (
                <div className="bg-black/10">
                  {m.children!.map((c) => {
                    const active = isPanelAction(c.action) && c.action.panel === activePanel;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => runAction(c.action)}
                        className={cx(
                          "w-full text-left pl-14 pr-4 py-2 text-sm hover:bg-white/10",
                          active ? "bg-white/10 text-white" : "text-white/80"
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {hasChildren && hoverKey === m.key && !isExpanded && (
                <div className="absolute left-[260px] top-0 z-50 w-64 bg-[#23282d] border border-white/10 shadow-xl rounded-md overflow-hidden">
                  <div className="px-3 py-2 text-xs text-white/70 border-b border-white/10">{m.label}</div>
                  <div className="py-1">
                    {m.children!.map((c) => {
                      const active = isPanelAction(c.action) && c.action.panel === activePanel;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => runAction(c.action)}
                          className={cx(
                            "w-full text-left px-3 py-2 text-sm hover:bg-white/10",
                            active ? "bg-white/10 text-white" : "text-white/85"
                          )}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const PanelComp = adminPanels[activePanel];
  const content = (
    <div className="p-4">
      <Suspense fallback={<AdminBlankPage title="Đang tải..." />}>
        {PanelComp ? <PanelComp /> : <AdminBlankPage title={`Panel not found: ${activePanel}`} />}
      </Suspense>
    </div>
  );

  return (
    <AdminNavProvider
      value={{
        activePanel,
        openPanel,
        goBack,
        canGoBack: panelStack.length > 1,
      }}
    >
      <AdminShell sidebar={sidebar} content={content} />
    </AdminNavProvider>
  );
}