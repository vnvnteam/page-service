
export default function AdminBlankPage({ title }: { title: string }) {
  return (
    <div className="h-full w-full rounded-2xl border bg-background p-6">
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">
        (Tạm thời là page trắng. Sau bạn render theo menu.)
      </div>
    </div>
  );
}