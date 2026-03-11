import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAdminNav } from "@/utils/nav";

type PageRow = {
  id: string;
  title: string;
  desc: string;
  isActive: boolean;
};

const MOCK_ROWS: PageRow[] = [
  { id: "1", title: "Trang Nhà", desc: "Trang 1 bài viết", isActive: true },
  { id: "2", title: "1-page", desc: "Trang 1 bài viết", isActive: true },
  { id: "3", title: "News - full", desc: "Trang nhiều bài viết", isActive: true },
  { id: "4", title: "News - Simple", desc: "Trang nhiều bài viết", isActive: true },
  { id: "5", title: "News - thumbnail", desc: "Trang nhiều bài viết", isActive: true },
];

export default function PagesListPage() {
  const nav = useAdminNav();
  
  const [rows, setRows] = useState<PageRow[]>(MOCK_ROWS);

  const [group, setGroup] = useState("top");
  const [parent, setParent] = useState("all");
  const [childCount, setChildCount] = useState("all");

  const [searchType, setSearchType] = useState("content");
  const [q, setQ] = useState("");

  const [pageSize, setPageSize] = useState("10");

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(keyword) ||
        r.desc.toLowerCase().includes(keyword)
    );
  }, [rows, q]);

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

  const toggleActive = (id: string, v: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: v } : r)));
  };

  return (
    <div className="p-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => nav.openPanel("pages.new")}>TẠO MỚI</Button>

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
              <SelectItem value="home">Nhánh cha: Trang Nhà</SelectItem>
              <SelectItem value="news">Nhánh cha: News</SelectItem>
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
          {filtered.map((r, idx) => (
            <div
              key={r.id}
              className="px-3 py-3 flex items-center gap-3 hover:bg-muted/30"
            >
              <div className="w-7 text-muted-foreground">{idx + 1}</div>

              <div className="flex-1">
                <div className="font-medium text-sky-700">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
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
                <Button size="sm" variant="outline" title="Edit">
                  ✎
                </Button>
                <Button size="sm" variant="outline" title="Delete">
                  🗑
                </Button>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold text-sky-600">
                  {r.isActive ? "BẬT" : "TẮT"}
                </div>
                <Switch
                  checked={r.isActive}
                  onCheckedChange={(v) => toggleActive(r.id, v)}
                />
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