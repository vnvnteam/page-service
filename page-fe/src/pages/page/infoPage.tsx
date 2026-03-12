import { useEffect, useMemo, useState } from "react";
import { useAdminNav } from "@/utils/nav";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  deletePage,
  getPageById,
  getPageLayouts,
  updatePage,
} from "@/utils/api";

import { PageLayoutEntity, PageType } from "@/types/layout";

function FieldRow({
  label,
  children,
  right,
}: {
  label: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 items-center gap-3">
      <div className="col-span-12 md:col-span-2">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
      </div>

      <div className="col-span-12 md:col-span-8 min-w-0">{children}</div>

      <div className="col-span-12 md:col-span-2 flex md:justify-end">{right}</div>
    </div>
  );
}

type Props = {
  id: string;
};

const TENANT_ID = "11111111-1111-1111-1111-111111111111";
const PREVIEW_BASE = "http://cmstest.zawcyber.com";

export default function PageInfoPage({ id }: Props) {
  const nav = useAdminNav();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState<PageType | null>(null);
  const [layouts, setLayouts] = useState<PageLayoutEntity[]>([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [pageType, setPageType] = useState("blank");
  const [parent, setParent] = useState("root");
  const [isActive, setIsActive] = useState(true);
  const [isHome, setIsHome] = useState(false);
  const [pageLayoutId, setPageLayoutId] = useState<string | null>(null);

  const maxChars = 1000;
  const leftChars = Math.max(0, maxChars - desc.length);

  const EMPTY_LAYOUT_VALUE = "__none__";

  useEffect(() => {
    void loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [pageData, layoutData] = await Promise.all([
        getPageById(id),
        getPageLayouts(TENANT_ID),
      ]);

      setPage(pageData);
      setLayouts(layoutData);

      setTitle(pageData.title ?? "");
      setDesc(pageData.desc ?? "");
      setPageType(mapStatusToPageType(pageData.status));
      setParent("root");
      setIsActive(pageData.status === "published");
      setIsHome(false);
      setPageLayoutId(pageData.pageLayoutId ?? null);
    } catch (error) {
      console.error("Load page info failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = useMemo(() => {
    if (!page) return "";
    return `${PREVIEW_BASE}/p${page.pageNo ?? ""}/${page.slug}`;
  }, [page]);

  const onSave = async () => {
    if (!page) return;

    try {
      setSaving(true);

      const updated = await updatePage(page.id, {
        title,
        desc,
        status: isActive ? "published" : "draft",
        pageLayoutId,
      });

      setPage(updated);
      setTitle(updated.title ?? "");
      setDesc(updated.desc ?? "");
      setIsActive(updated.status === "published");
      setPageLayoutId(updated.pageLayoutId ?? null);
    } catch (error) {
      console.error("Update page failed:", error);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!page) return;

    const ok = window.confirm("Bạn có chắc muốn xóa trang này?");
    if (!ok) return;

    try {
      await deletePage(page.id);
      nav.openPanel("pages.list");
    } catch (error) {
      console.error("Delete page failed:", error);
      alert("Xóa thất bại");
    }
  };

  if (loading) {
    return <div className="p-4">Đang tải dữ liệu...</div>;
  }

  if (!page) {
    return <div className="p-4">Không tìm thấy trang</div>;
  }

  return (
    <div className="border rounded-md bg-white shadow-sm">
      {/* Top actions */}
      <div className="flex items-center gap-2 p-3">
        <Button variant="outline" onClick={() => nav.goBack()} disabled={!nav.canGoBack}>
          QUAY LẠI
        </Button>

        <Button variant="outline" onClick={() => nav.openPanel("pages.new")}>
          TẠO MỚI
        </Button>

        <div className="flex-1" />

        <Button variant="outline" onClick={onDelete} disabled={saving}>
          XÓA
        </Button>

        <Button onClick={onSave} disabled={saving}>
          LƯU
        </Button>
      </div>

      <Separator />

      {/* Tabs */}
      <div className="flex border-b bg-muted/30">
        <button className="border-r bg-white px-6 py-3 text-sm font-medium text-foreground">
          TIÊU ĐỀ
        </button>

        <button
          className="border-r px-6 py-3 text-sm font-medium text-muted-foreground"
          onClick={() => nav.openPanel("pages.edit", { id: page.id, tab: "display" })}
        >
          HIỂN THỊ
        </button>

        <button
          className="px-6 py-3 text-sm font-medium text-muted-foreground"
          onClick={() => nav.openPanel("pages.edit", { id: page.id, tab: "detail" })}
        >
          CHI TIẾT
        </button>
      </div>

      <div className="space-y-0">
        {/* Title + homepage */}
        <div className="grid grid-cols-12 border-b">
          <div className="col-span-12 md:col-span-8 p-4">
            <div className="grid grid-cols-[90px_1fr] gap-4 items-center">
              <div className="h-[64px] w-[64px] rounded border bg-muted flex items-center justify-center">
                🖼
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Tiêu đề trang
                </div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 border-t md:border-l md:border-t-0 p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                Đặt làm trang nhà
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={isHome} onCheckedChange={setIsHome} />
                <div className="text-xs font-semibold text-muted-foreground">
                  {isHome ? "BẬT" : "TẮT"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview url */}
        <div className="border-b p-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Đường dẫn xem trang
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-sky-700 hover:underline"
            >
              {previewUrl}
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(previewUrl);
              }}
            >
              Sao chép
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="border-b p-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Mô tả ngắn
            </div>

            <Textarea
              className="min-h-[120px]"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="text-right text-xs text-muted-foreground">
              {desc.length} ký tự | {leftChars} ký tự còn lại |{" "}
              {desc.trim() ? desc.trim().split(/\s+/).length : 0} từ
            </div>
          </div>
        </div>

        {/* Page type */}
        <div className="border-b p-4">
          <FieldRow label="Kiểu trang">
            <Select value={pageType} onValueChange={setPageType}>
              <SelectTrigger className="w-full md:w-[280px] h-10">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="max-h-60 overflow-y-auto" position="popper">
                <SelectItem value="blank">Trang trống</SelectItem>
                <SelectItem value="html">Trang HTML</SelectItem>
                <SelectItem value="external">Liên kết</SelectItem>
                <SelectItem value="post_single">Trang 1 bài viết</SelectItem>
                <SelectItem value="post_list">Trang nhiều bài viết</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
        </div>

        {/* Parent + active */}
        <div className="border-b p-4">
          <FieldRow
            label="Nhánh cha"
            right={
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold text-sky-600">
                  {isActive ? "BẬT" : "TẮT"}
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            }
          >
            <Select value={parent} onValueChange={setParent}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="max-h-60 overflow-y-auto" position="popper">
                <SelectItem value="root">Danh mục trên cùng</SelectItem>
                <SelectItem value="side">Danh mục bên</SelectItem>
                <SelectItem value="bottom">Danh mục dưới cùng</SelectItem>
                <SelectItem value="hidden">Danh mục ẩn</SelectItem>
                <SelectItem value="mobile">Danh mục cho di động</SelectItem>
                <SelectItem value="tablet">Danh mục cho máy tính bảng</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
        </div>

        {/* Layout */}
        <div className="p-4">
          <FieldRow label="Bố cục trang">
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={pageLayoutId ?? EMPTY_LAYOUT_VALUE}
                onValueChange={(v) => setPageLayoutId(v === EMPTY_LAYOUT_VALUE ? null : v)}
              >
                <SelectTrigger className="w-full md:w-[280px] h-10">
                  <SelectValue placeholder="Chọn layout" />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto" position="popper">
                  <SelectItem value={EMPTY_LAYOUT_VALUE}>Không dùng layout</SelectItem>

                  {layouts.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id}>
                      {layout.name} (v{layout.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => nav.openPanel("page-layout.edit", { id: pageLayoutId })}
                disabled={!pageLayoutId}
              >
                CHỈNH SỬA
              </Button>
            </div>
          </FieldRow>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between p-3 text-xs text-muted-foreground">
        <div>
          Cập nhập lần cuối vào{" "}
          {new Date(page.updatedAt).toLocaleString("vi-VN")}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onDelete} disabled={saving}>
            XÓA
          </Button>
          <Button onClick={onSave} disabled={saving}>
            LƯU
          </Button>
        </div>
      </div>
    </div>
  );
}

function mapStatusToPageType(status: string) {
  if (status === "published") return "post_list";
  return "blank";
}