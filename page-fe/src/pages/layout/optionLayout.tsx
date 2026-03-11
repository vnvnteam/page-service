import type { LayoutBlock, LayoutZone } from "@/types/layout";

interface Props {
  zone: LayoutZone;
  block: LayoutBlock | null;
  onUpdateOptions: (
    zone: LayoutZone,
    blockId: string,
    nextOptions: Record<string, unknown>,
  ) => void;
}

export default function BlockOptionsEditor({
  zone,
  block,
  onUpdateOptions,
}: Props) {
  if (!block) {
    return (
      <div
        style={{
          padding: 12,
          border: "1px dashed #d1d5db",
          borderRadius: 10,
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        Chọn một block để chỉnh options
      </div>
    );
  }

  const options = block.options || {};

  const updateField = (key: string, value: unknown) => {
    onUpdateOptions(zone, block.id, {
      ...options,
      [key]: value,
    });
  };

  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#ffffff",
        display: "grid",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{block.type}</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>Block options editor</div>
      </div>

      {block.type === "logo" && (
        <Field
          label="Text"
          value={String(options.text ?? "")}
          onChange={(value) => updateField("text", value)}
        />
      )}

      {block.type === "navigation" && (
        <>
          <Field
            label="Items (phân tách bằng dấu phẩy)"
            value={Array.isArray(options.items) ? options.items.join(", ") : ""}
            onChange={(value) =>
              updateField(
                "items",
                value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
          />
          <Field
            label="Align"
            value={String(options.align ?? "right")}
            onChange={(value) => updateField("align", value)}
          />
        </>
      )}

      {block.type === "banner" && (
        <>
          <Field
            label="Title"
            value={String(options.title ?? "")}
            onChange={(value) => updateField("title", value)}
          />
          <Field
            label="Subtitle"
            value={String(options.subtitle ?? "")}
            onChange={(value) => updateField("subtitle", value)}
          />
          <Field
            label="Button Text"
            value={String(options.buttonText ?? "")}
            onChange={(value) => updateField("buttonText", value)}
          />
          <Field
            label="Background Image"
            value={String(options.backgroundImage ?? "")}
            onChange={(value) => updateField("backgroundImage", value)}
          />
        </>
      )}

      {block.type === "section" && (
        <>
          <Field
            label="Title"
            value={String(options.title ?? "")}
            onChange={(value) => updateField("title", value)}
          />
          <Field
            label="Description"
            value={String(options.description ?? "")}
            onChange={(value) => updateField("description", value)}
          />
          <Field
            label="Columns"
            value={String(options.columns ?? 1)}
            onChange={(value) => updateField("columns", Number(value) || 1)}
          />
        </>
      )}

      {block.type === "footer_menu" && (
        <Field
          label="Items (phân tách bằng dấu phẩy)"
          value={Array.isArray(options.items) ? options.items.join(", ") : ""}
          onChange={(value) =>
            updateField(
              "items",
              value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            )
          }
        />
      )}

      {block.type === "copyright" && (
        <Field
          label="Text"
          value={String(options.text ?? "")}
          onChange={(value) => updateField("text", value)}
        />
      )}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
        {props.label}
      </label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}