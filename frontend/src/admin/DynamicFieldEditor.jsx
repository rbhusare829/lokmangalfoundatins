import { Plus, Trash2 } from "lucide-react";

function prettifyLabel(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// Recursively renders an editable form for any JSON-shaped value (the site
// content blocks are arbitrarily nested strings/arrays/objects) without
// needing bespoke UI per page — every string becomes a text/textarea input,
// every array becomes an add/remove-able list, every object becomes a
// labeled group of its own fields, all the way down.
export default function DynamicFieldEditor({ value, onChange }) {
  if (typeof value === "string") {
    const long = value.length > 80 || value.includes("\n");
    if (long) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(3, Math.ceil(value.length / 60)))}
          className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
      />
    );
  }

  if (Array.isArray(value)) {
    const template = value.length > 0 ? value[0] : "";
    const addItem = () => {
      const clone = typeof template === "object" && template !== null ? JSON.parse(JSON.stringify(template)) : "";
      onChange([...value, clone]);
    };
    const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));
    const updateAt = (i, newItem) => onChange(value.map((item, idx) => (idx === i ? newItem : item)));

    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-light-green-tint bg-[#FAFAF7] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary-text">Item {i + 1}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <DynamicFieldEditor value={item} onChange={(v) => updateAt(i, v)} />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-full border border-dashed border-brand-green-primary px-3 py-1.5 text-xs font-bold text-brand-green-primary hover:bg-light-green-tint"
        >
          <Plus size={13} /> Add Item
        </button>
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div className="space-y-4">
        {Object.entries(value).map(([key, val]) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-semibold text-secondary-text">{prettifyLabel(key)}</label>
            <DynamicFieldEditor value={val} onChange={(v) => onChange({ ...value, [key]: v })} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
    />
  );
}
