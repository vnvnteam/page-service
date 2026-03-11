import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminShell({
  sidebar,
  content,
}: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-muted/30">
      {/* Header fixed */}
      <div className="h-14 bg-sky-300/80 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-white drop-shadow">vn CMS 3.0</div>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="vi">
            <SelectTrigger className="w-[140px] bg-white/80">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="secondary">Xin chào, Longdev</Button>
        </div>
      </div>

      {/* Body */}
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-[260px_1fr]">
        <aside className="h-full">{sidebar}</aside>
        <main className="h-full overflow-auto">{content}</main>
      </div>
    </div>
  );
}