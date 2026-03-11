import BlockOptionsEditor from "@/pages/layout/optionLayout";
import type {
  LayoutBlock,
  LayoutJson,
  LayoutZone,
  SelectedBlockRef,
} from "@/types/layout";

interface Props {
  layoutJson: LayoutJson;
  selectedBlock: SelectedBlockRef | null;
  selectedBlockData: LayoutBlock | null;
  onSelectBlock: (block: SelectedBlockRef | null) => void;
  onAddBlock: (zone: LayoutZone, type: LayoutBlock["type"]) => void;
  onRemoveBlock: (zone: LayoutZone, blockId: string) => void;
  onToggleBlock: (zone: LayoutZone, blockId: string) => void;
  onMoveBlock: (
    zone: LayoutZone,
    blockId: string,
    direction: "up" | "down",
  ) => void;
  onUpdateOptions: (
    zone: LayoutZone,
    blockId: string,
    nextOptions: Record<string, unknown>,
  ) => void;
}

const zones: LayoutZone[] = ["header", "main", "footer"];

export default function LayoutPanel({
  layoutJson,
  selectedBlock,
  selectedBlockData,
  onSelectBlock,
  onAddBlock,
  onRemoveBlock,
  onToggleBlock,
  onMoveBlock,
  onUpdateOptions,
}: Props) {
  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: 16,
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>Layout Builder</div>
        <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280" }}>
          Add block sẽ không làm nhảy màn, chỉ scroll trong panel
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 16,
          boxSizing: "border-box",
          display: "grid",
          gap: 16,
        }}
      >
        {zones.map((zone) => {
          const zoneBlocks = [...layoutJson.zones[zone]].sort(
            (a, b) => a.sort - b.sort,
          );

          return (
            <div
              key={zone}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
                  {zone}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {zone === "header" && (
                    <>
                      <button
                        style={buttonStyle}
                        onClick={() => onAddBlock(zone, "logo")}
                      >
                        + Logo
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={() => onAddBlock(zone, "navigation")}
                      >
                        + Navigation
                      </button>
                    </>
                  )}

                  {zone === "main" && (
                    <>
                      <button
                        style={buttonStyle}
                        onClick={() => onAddBlock(zone, "banner")}
                      >
                        + Banner
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={() => onAddBlock(zone, "section")}
                      >
                        + Section
                      </button>
                    </>
                  )}

                  {zone === "footer" && (
                    <>
                      <button
                        style={buttonStyle}
                        onClick={() => onAddBlock(zone, "footer_menu")}
                      >
                        + Footer Menu
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={() => onAddBlock(zone, "copyright")}
                      >
                        + Copyright
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {zoneBlocks.length === 0 && (
                  <div style={{ fontSize: 14, color: "#9ca3af" }}>
                    Chưa có block nào trong zone này
                  </div>
                )}

                {zoneBlocks.map((block, index) => {
                  const isSelected =
                    selectedBlock?.zone === zone &&
                    selectedBlock.blockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={() =>
                        onSelectBlock({
                          zone,
                          blockId: block.id,
                        })
                      }
                      style={{
                        border: isSelected
                          ? "1px solid #2563eb"
                          : "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: 10,
                        background: block.isEnabled ? "#fff" : "#f3f4f6",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{block.type}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            sort: {block.sort}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button
                            style={buttonStyle}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveBlock(zone, block.id, "up");
                            }}
                            disabled={index === 0}
                          >
                            ↑
                          </button>

                          <button
                            style={buttonStyle}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveBlock(zone, block.id, "down");
                            }}
                            disabled={index === zoneBlocks.length - 1}
                          >
                            ↓
                          </button>

                          <button
                            style={buttonStyle}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBlock(zone, block.id);
                            }}
                          >
                            {block.isEnabled ? "Disable" : "Enable"}
                          </button>

                          <button
                            style={dangerButtonStyle}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveBlock(zone, block.id);
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <BlockOptionsEditor
          zone={selectedBlock?.zone ?? "main"}
          block={selectedBlockData}
          onUpdateOptions={onUpdateOptions}
        />

        <details
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
            background: "#ffffff",
          }}
        >
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>
            Xem raw layout_json
          </summary>
          <pre
            style={{
              marginTop: 12,
              whiteSpace: "pre-wrap",
              fontSize: 12,
              color: "#374151",
            }}
          >
            {JSON.stringify(layoutJson, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #dc2626",
  background: "#ffffff",
  color: "#dc2626",
  cursor: "pointer",
};