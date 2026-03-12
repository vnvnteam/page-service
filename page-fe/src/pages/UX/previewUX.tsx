import type { UXBlock, UXContentJson } from "@/types/ux";
import { itemsTextToArray } from "@/utils/uxUtil";

type Props = {
  content: UXContentJson;
};

export default function PreviewRenderer({ content }: Props) {
  return (
    <div className="h-full overflow-y-auto bg-slate-100 p-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="rounded-md border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {content.header.map((block) => renderBlock(block))}
          </div>
        </div>

        <div className="space-y-4">
          {content.main.map((block) => renderBlock(block))}
        </div>

        <div className="rounded-md border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {content.footer.map((block) => renderBlock(block))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: UXBlock) {
  const p = block.props || {};

  switch (block.type) {
    case "logo":
      return (
        <div key={block.id} className="font-bold text-slate-800" style={{ width: Number(p.width || 120) }}>
          {p.image ? (
            <img
              src={String(p.image)}
              alt={String(p.text || "logo")}
              style={{ width: Number(p.width || 120) }}
            />
          ) : (
            String(p.text || "Logo")
          )}
        </div>
      );

    case "navigation":
      return (
        <div
          key={block.id}
          className="flex flex-wrap gap-4 text-sm text-slate-700"
          style={{
            justifyContent:
              p.align === "center" ? "center" : p.align === "left" ? "flex-start" : "flex-end",
            width: "100%",
          }}
        >
          {itemsTextToArray(String(p.itemsText || "")).map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      );

    case "banner":
      return (
        <div
          key={block.id}
          className="rounded-md border bg-sky-50 p-6"
          style={{
            minHeight: Number(p.height || 280),
            backgroundImage: p.image ? `url(${String(p.image)})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-xl rounded-md bg-white/80 p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-slate-800">{String(p.title || "")}</div>
            <div className="mt-2 text-sm text-slate-600">{String(p.subtitle || "")}</div>
            <button className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white">
              {String(p.buttonText || "Xem thêm")}
            </button>
          </div>
        </div>
      );

    case "section":
      return (
        <div key={block.id} className="rounded-md border bg-white p-5">
          <div className="text-lg font-semibold">{String(p.title || "")}</div>
          <div className="mt-2 text-sm text-slate-600">{String(p.description || "")}</div>

          <div
            className="mt-4 grid"
            style={{
              gridTemplateColumns: `repeat(${Number(p.columns || 1)}, minmax(0, 1fr))`,
              gap: Number(p.gap || 16),
            }}
          >
            {Array.from({ length: Number(p.columns || 1) }).map((_, idx) => (
              <div key={idx} className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Column {idx + 1}
              </div>
            ))}
          </div>
        </div>
      );

    case "footer_menu":
      return (
        <div key={block.id} className="flex flex-wrap gap-4 text-sm text-slate-700">
          {itemsTextToArray(String(p.itemsText || "")).map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      );

    case "copyright":
      return (
        <div key={block.id} className="text-sm text-muted-foreground">
          {String(p.text || "")}
        </div>
      );

    default:
      return null;
  }
}