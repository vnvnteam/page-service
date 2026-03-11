/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAdminNav } from "@/utils/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { createPage, getPageLayouts } from "@/utils/api";

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
        <div className="text-sm font-medium text-muted-foreground">
          {label}
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 min-w-0">{children}</div>

      <div className="col-span-12 md:col-span-2 flex md:justify-end">
        {right}
      </div>
    </div>
  );
}

export default function PageCreatePage() {
  const nav = useAdminNav();

  const tenantId = "11111111-1111-1111-1111-111111111111";

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [pageType, setPageType] = useState("blank");
  const [parent, setParent] = useState("root");
  const [isActive, setIsActive] = useState(true);

  const [pageLayouts, setPageLayouts] = useState<any[]>([]);
  const [pageLayoutId, setPageLayoutId] = useState<string | null>(null);

  const maxChars = 1000;
  const leftChars = Math.max(0, maxChars - desc.length);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const data = await getPageLayouts(tenantId);
      setPageLayouts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSave = async () => {
    try {
      const payload = {
        tenantId,
        title,
        desc,
        status: isActive ? "published" : "draft",
        pageLayoutId,
      };

      const result = await createPage(payload);

      console.log("Page created:", result);

      nav.openPanel("pages.list");
    } catch (err) {
      console.error(err);
      alert("Create page failed");
    }
  };

  return (
    <div className="bg-white border rounded-md shadow-sm">
      {/* top actions */}
      <div className="p-3 flex items-center gap-2">
        <Button variant="outline" onClick={() => nav.goBack()}>
          QUAY LẠI
        </Button>

        <Button variant="outline" onClick={() => nav.openPanel("pages.list")}>
          DANH SÁCH
        </Button>

        <div className="flex-1" />

        <Button onClick={onSave}>LƯU</Button>
      </div>

      <Separator />

      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="grid grid-cols-[90px_1fr] gap-4 items-center">
          <div className="h-[64px] w-[64px] border bg-muted flex items-center justify-center rounded">
            🖼
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Tiêu đề trang
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Mô tả ngắn
          </div>

          <Textarea
            className="min-h-[120px]"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div className="text-xs text-muted-foreground text-right">
            {desc.length} ký tự | {leftChars} còn lại
          </div>
        </div>

        {/* Page type */}
        <FieldRow label="Kiểu trang">
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="blank">Trang trống</SelectItem>
              <SelectItem value="html">Trang HTML</SelectItem>
              <SelectItem value="external">Liên kết</SelectItem>
              <SelectItem value="post_single">Trang 1 bài viết</SelectItem>
              <SelectItem value="post_list">Trang nhiều bài viết</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>

        {/* Page layout */}
        <FieldRow label="Page Layout">
          <Select
            value={pageLayoutId ?? ""}
            onValueChange={(v) =>
              setPageLayoutId(v === "" ? null : v)
            }
          >
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Chọn layout" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="">Không dùng layout</SelectItem>

              {pageLayouts.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name} (v{l.version})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        {/* Parent + Active */}
        <FieldRow
          label="Nhánh cha"
          right={
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold text-sky-600">
                {isActive ? "BẬT" : "TẮT"}
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          }
        >
          <Select value={parent} onValueChange={setParent}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="root">Danh mục trên cùng</SelectItem>
              <SelectItem value="side">Danh mục bên</SelectItem>
              <SelectItem value="bottom">Danh mục dưới cùng</SelectItem>
              <SelectItem value="hidden">Danh mục ẩn</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
      </div>

      <Separator />

      <div className="p-3 flex justify-end">
        <Button onClick={onSave}>LƯU</Button>
      </div>
    </div>
  );
}