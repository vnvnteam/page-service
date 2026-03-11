import type { LayoutBlock, LayoutJson, LayoutZone } from "@/types/layout";

interface Props {
  layoutJson: LayoutJson;
}

export default function LayoutPreview({ layoutJson }: Props) {
  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        padding: 16,
        boxSizing: "border-box",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <header style={zoneContainerStyle}>
          {renderZoneBlocks("header", layoutJson)}
        </header>

        <main style={{ display: "grid", gap: 16 }}>
          {renderZoneBlocks("main", layoutJson)}
        </main>

        <footer style={zoneContainerStyle}>
          {renderZoneBlocks("footer", layoutJson)}
        </footer>
      </div>
    </div>
  );
}

function renderZoneBlocks(zone: LayoutZone, layoutJson: LayoutJson) {
  return [...layoutJson.zones[zone]]
    .filter((block) => block.isEnabled)
    .sort((a, b) => a.sort - b.sort)
    .map((block) => renderBlock(block));
}

function renderBlock(block: LayoutBlock) {
  const options = block.options || {};

  switch (block.type) {
    case "logo":
      return (
        <div key={block.id} style={{ fontWeight: 800, fontSize: 18 }}>
          {String(options.text ?? "Logo")}
        </div>
      );

    case "navigation":
      return (
        <nav
          key={block.id}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {Array.isArray(options.items) &&
            options.items.map((item, index) => <span key={index}>{String(item)}</span>)}
        </nav>
      );

    case "banner":
      return (
        <section
          key={block.id}
          style={{
            padding: 24,
            borderRadius: 12,
            border: "1px solid #bfdbfe",
            background: "#dbeafe",
          }}
        >
          <h2 style={{ marginTop: 0 }}>{String(options.title ?? "Banner")}</h2>
          <p>{String(options.subtitle ?? "")}</p>
          <button
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            {String(options.buttonText ?? "Xem thêm")}
          </button>
        </section>
      );

    case "section":
      return (
        <section
          key={block.id}
          style={{
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{String(options.title ?? "Section")}</h3>
          <p style={{ marginBottom: 0 }}>
            {String(options.description ?? "")}
          </p>
        </section>
      );

    case "footer_menu":
      return (
        <div
          key={block.id}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {Array.isArray(options.items) &&
            options.items.map((item, index) => <span key={index}>{String(item)}</span>)}
        </div>
      );

    case "copyright":
      return (
        <div key={block.id} style={{ color: "#6b7280" }}>
          {String(options.text ?? "© Copyright")}
        </div>
      );

    default:
      return null;
  }
}

const zoneContainerStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
};