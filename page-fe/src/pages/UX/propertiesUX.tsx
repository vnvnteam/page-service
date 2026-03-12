/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOCK_REGISTRY } from "@/utils/uxBlock";
import type { UXBlock, UXZone } from "@/types/ux";

type Props = {
  zone: UXZone | null;
  block: UXBlock | null;
  onChange: (zone: UXZone, blockId: string, nextProps: Record<string, any>) => void;
};

export default function BlockProperties({ zone, block, onChange }: Props) {
  if (!zone || !block) {
    return (
      <div className="h-full overflow-y-auto border-l bg-white p-4">
        <div className="text-sm font-semibold text-slate-700">THUỘC TÍNH BLOCK</div>
        <div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Chọn một block để chỉnh sửa thuộc tính
        </div>
      </div>
    );
  }

  const def = BLOCK_REGISTRY[block.type];
  const safeZone = zone;
  const safeBlock = block;

  function updateField(key: string, value: any) {
    onChange(safeZone, safeBlock.id, {
      ...safeBlock.props,
      [key]: value,
    });
  }

  return (
    <div className="h-full overflow-y-auto border-l bg-white p-4">
      <div className="text-sm font-semibold text-slate-700">THUỘC TÍNH BLOCK</div>

      <div className="mt-3 rounded-md border bg-slate-50 p-3">
        <div className="text-sm font-medium">{def.label}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          type: {block.type} · zone: {zone}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {def.fields.map((field) => {
          const value = block.props?.[field.key];

          if (field.type === "textarea") {
            return (
              <div key={field.key} className="space-y-2">
                <div className="text-sm font-medium">{field.label}</div>
                <Textarea
                  value={String(value ?? "")}
                  placeholder={field.placeholder}
                  onChange={(e) => updateField(field.key, e.target.value)}
                />
              </div>
            );
          }

          if (field.type === "number") {
            return (
              <div key={field.key} className="space-y-2">
                <div className="text-sm font-medium">{field.label}</div>
                <Input
                  type="number"
                  value={String(value ?? 0)}
                  onChange={(e) => updateField(field.key, Number(e.target.value))}
                />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.key} className="space-y-2">
                <div className="text-sm font-medium">{field.label}</div>
                <Select
                  value={String(value ?? "")}
                  onValueChange={(v) => updateField(field.key, v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giá trị" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          return (
            <div key={field.key} className="space-y-2">
              <div className="text-sm font-medium">{field.label}</div>
              <Input
                value={String(value ?? "")}
                placeholder={field.placeholder}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}