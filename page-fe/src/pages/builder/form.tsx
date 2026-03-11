/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropField, PropsSchema } from "@/types/block";

function normalizeOptions(field: any): Array<{ label: string; value: any }> {
  const opts = field.options ?? [];
  if (opts.length === 0) return [];
  if (typeof opts[0] === "object") return opts as any;
  return opts.map((v: any) => ({ label: String(v), value: v }));
}

export function SchemaForm({
  schema,
  value,
  onChange,
  onPickContent,
}: {
  schema: PropsSchema;
  value: Record<string, any>;
  onChange: (patch: Record<string, any>) => void;
  onPickContent?: () => Promise<{ id: string; title?: string } | null>;
}) {
  const props = schema.props ?? {};

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Object.entries(props).map(([key, field]) => (
        <Field
          key={key}
          propKey={key}
          field={field}
          current={value[key]}
          onChange={(v) => onChange({ [key]: v })}
          onPickContent={onPickContent}
        />
      ))}
    </div>
  );
}

function Field({
  propKey,
  field,
  current,
  onChange,
  onPickContent,
}: {
  propKey: string;
  field: PropField;
  current: any;
  onChange: (v: any) => void;
  onPickContent?: () => Promise<{ id: string; title?: string } | null>;
}) {
  const label = (field as any).label ?? propKey;

  // string
  if (field.type === "string") {
    const ui = field.ui;
    if (ui === "textarea") {
      return (
        <div>
          <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
          <textarea
            style={{ width: "100%", height: 110 }}
            value={current ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }

    if (ui === "color") {
      return (
        <div>
          <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
          <input style={{ width: "100%" }} value={current ?? "#ffffff"} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    }

    if (ui === "select" || ui === "segmented") {
      const opts = normalizeOptions(field);
      return (
        <div>
          <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
          <select style={{ width: "100%" }} value={current ?? ""} onChange={(e) => onChange(e.target.value)}>
            <option value="" disabled>
              Select...
            </option>
            {opts.map((o) => (
              <option key={String(o.value)} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
        <input style={{ width: "100%" }} value={current ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  // number
  if (field.type === "number") {
    if (field.ui === "select") {
      const opts = field.options ?? [];
      return (
        <div>
          <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
          <select
            style={{ width: "100%" }}
            value={Number(current ?? "")}
            onChange={(e) => onChange(Number(e.target.value))}
          >
            {opts.map((o:any) => (
              <option key={String(o.value)} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          style={{ width: "100%" }}
          value={current ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }

  // boolean
  if (field.type === "boolean") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" checked={!!current} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </div>
    );
  }

  // ref
  if (field.type === "ref") {
    return (
      <div>
        <label style={{ fontSize: 12, color: "#555" }}>{label}</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ flex: 1 }} value={current ?? ""} readOnly />
          <button
            onClick={async () => {
              const picked = (await onPickContent?.()) ?? null;
              if (picked) onChange(picked.id);
            }}
          >
            Pick
          </button>
          <button onClick={() => onChange(null)}>Clear</button>
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
          Ref: {field.ref.table}.{field.ref.valueField}
        </div>
      </div>
    );
  }

  return null;
}
