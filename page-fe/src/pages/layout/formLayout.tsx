import type { PageLayoutEntity, PageLayoutFormState } from "@/types/layout";

interface Props {
  items: PageLayoutEntity[];
  loadingList: boolean;
  saving: boolean;
  form: PageLayoutFormState;
  message: string;
  onSelectLayout: (id: string) => void;
  onUpdateForm: <K extends keyof PageLayoutFormState>(
    key: K,
    value: PageLayoutFormState[K],
  ) => void;
  onToggleActive: (nextValue: boolean) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onReset: () => void;
}

export default function PageLayoutMetaForm({
  items,
  loadingList,
  saving,
  form,
  message,
  onSelectLayout,
  onUpdateForm,
  onToggleActive,
  onCreate,
  onUpdate,
  onDelete,
  onReset,
}: Props) {
  return (
    <div
      style={{
        padding: 16,
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
        display: "grid",
        gap: 12,
        flexShrink: 0,
      }}
    >
      <div>
        <label style={labelStyle}>Chọn page layout để chỉnh sửa</label>
        <select
          value={form.selectedId}
          onChange={(e) => onSelectLayout(e.target.value)}
          style={inputStyle}
        >
          <option value="">-- Tạo mới --</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - v{item.version} {item.isActive ? "(Active)" : "(Inactive)"}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input
            value={form.name}
            onChange={(e) => onUpdateForm("name", e.target.value)}
            placeholder="Nhập tên page layout"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Version</label>
          <input
            type="number"
            value={form.version}
            onChange={(e) => onUpdateForm("version", Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Layout Type</label>
          <select
            value={form.layoutType}
            onChange={(e) => onUpdateForm("layoutType", e.target.value)}
            style={inputStyle}
          >
            <option value="default">default</option>
            <option value="landing">landing</option>
            <option value="blog">blog</option>
            <option value="product">product</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>CSS Bundle Path</label>
          <input
            value={form.cssBundlePath ?? ""}
            onChange={(e) =>
              onUpdateForm("cssBundlePath", e.target.value || null)
            }
            placeholder="/assets/layouts/landing.css"
            style={inputStyle}
          />
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
        }}
      >
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => onToggleActive(e.target.checked)}
        />
        Is Active
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          style={primaryButtonStyle}
          onClick={onCreate}
          disabled={saving || !form.name.trim()}
        >
          Create
        </button>

        <button
          style={secondaryButtonStyle}
          onClick={onUpdate}
          disabled={saving || !form.selectedId}
        >
          Update
        </button>

        <button
          style={dangerButtonStyle}
          onClick={onDelete}
          disabled={saving || !form.selectedId}
        >
          Delete
        </button>

        <button
          style={secondaryButtonStyle}
          onClick={onReset}
          disabled={saving}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          fontSize: 13,
          color: loadingList ? "#6b7280" : "#374151",
        }}
      >
        {loadingList ? "Đang tải danh sách layout..." : message || "Sẵn sàng"}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#111827",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #dc2626",
  background: "#dc2626",
  color: "#ffffff",
  cursor: "pointer",
};