import { useEffect, useMemo, useState } from "react";
import { useAdminNav } from "@/utils/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { deletePage, getPages } from "@/utils/api";
import { type PageType } from "@/types/layout";

type PageRow = {
  id: string;
  title: string;
  desc: string;
  status: string;
  slug: string;
  pageNo: number | null;
};

const TENANT_ID = "11111111-1111-1111-1111-111111111111";

export default function PagesListPage() {
  const nav = useAdminNav();

  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [group, setGroup] = useState("all");
  const [parent, setParent] = useState("all");
  const [childCount, setChildCount] = useState("all");

  const [searchType, setSearchType] = useState("content");
  const [q, setQ] = useState("");

  const [pageSize, setPageSize] = useState("10");

  useEffect(() => {
    void loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);

      const data = await getPages(TENANT_ID);

      const mapped: PageRow[] = data.map((item: PageType) => ({
        id: item.id,
        title: item.title ?? "(Chưa có tiêu đề)",
        desc: item.desc ?? "",
        status: item.status,
        slug: item.slug,
        pageNo: item.pageNo,
      }));

      setRows(mapped);
    } catch (error) {
      console.error("Load pages failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let next = [...rows];

    if (keyword) {
      next = next.filter((r) => {
        if (searchType === "title") {
          return r.title.toLowerCase().includes(keyword);
        }

        if (searchType === "slug") {
          return r.slug.toLowerCase().includes(keyword);
        }

        return (
          r.title.toLowerCase().includes(keyword) ||
          r.desc.toLowerCase().includes(keyword)
        );
      });
    }

    return next.slice(0, Number(pageSize));
  }, [rows, q, searchType, pageSize]);

  const move = (id: string, dir: -1 | 1) => {
    setRows((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;

      const nextIdx = idx + dir;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;

      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(nextIdx, 0, item);
      return copy;
    });
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn xóa trang này?");
    if (!ok) return;

    const backup = rows;
    setRows((prev) => prev.filter((r) => r.id !== id));

    try {
      await deletePage(id);
    } catch (error) {
      console.error("Delete page failed:", error);
      setRows(backup);
    }
  };

  const goToPageInfo = (id: string) => {
    console.log("xin chao",id);
    nav.openPanel("pages.info", { id });
  };

  return (
    <div className="p-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => nav.openPanel("pages.new")}>
          TẠO MỚI
        </Button>

        <div className="flex items-center gap-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">Nội dung</SelectItem>
              <SelectItem value="title">Tiêu đề</SelectItem>
              <SelectItem value="slug">Slug</SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="w-[420px] bg-white"
            placeholder="Tìm kiếm"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <Button variant="secondary">🔍</Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="mt-3 rounded-md border bg-white">
        <div className="p-3 flex flex-wrap items-center gap-3">
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Nhóm: Tất cả</SelectItem>
              <SelectItem value="top">Nhóm: Danh mục trên cùng</SelectItem>
              <SelectItem value="footer">Nhóm: Footer</SelectItem>
              <SelectItem value="system">Nhóm: System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={parent} onValueChange={setParent}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Nhánh cha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Nhánh cha: Tất cả</SelectItem>
              <SelectItem value="root">Nhánh cha: root</SelectItem>
            </SelectContent>
          </Select>

          <Select value={childCount} onValueChange={setChildCount}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Số nhánh con" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Số nhánh con: Tất cả</SelectItem>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2+</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Table list */}
        <div className="divide-y">
          {loading && (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Đang tải dữ liệu...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Không có dữ liệu
            </div>
          )}

          {!loading &&
            filtered.map((r, idx) => (
              <div
                key={r.id}
                className="px-3 py-3 flex items-center gap-3 hover:bg-muted/30"
              >
                <div className="w-7 text-muted-foreground">{idx + 1}</div>

                <div className="flex-1">
                  <button
                    type="button"
                    className="font-medium text-sky-700 hover:underline text-left"
                    onClick={() => goToPageInfo(r.id)}
                  >
                    {r.title}
                  </button>

                  <div className="text-xs text-muted-foreground">
                    {r.desc || "Không có mô tả"}
                  </div>

                  <div className="text-[11px] text-muted-foreground mt-1">
                    slug: {r.slug} {r.pageNo ? `· page_no: ${r.pageNo}` : ""}
                  </div>
                </div>

                {/* Move */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => move(r.id, -1)}
                    disabled={idx === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => move(r.id, 1)}
                    disabled={idx === filtered.length - 1}
                  >
                    ↓
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    title="Edit"
                    onClick={() => goToPageInfo(r.id)}
                  >
                    ✎
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    title="Delete"
                    onClick={() => void handleDelete(r.id)}
                  >
                    🗑
                  </Button>
                </div>

                {/* Status */}
                <div className="min-w-[80px] text-right">
                  <div
                    className={`text-xs font-semibold ${
                      r.status === "published"
                        ? "text-sky-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {r.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Separator />

        <div className="p-3 flex justify-end">
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}