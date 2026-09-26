import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { api, extractErrorMessage } from "../lib/api.js";

function buildFormData(fields, values) {
  const fd = new FormData();
  for (const field of fields) {
    if (field.type === "file" || field.type === "pdf") {
      const fileList = values[field.name];
      if (fileList && fileList.length > 0) fd.append(field.name, fileList[0]);
    } else {
      fd.append(field.name, values[field.name] ?? "");
    }
  }
  return fd;
}

function FieldInput({ field, register, isEditing, suggestions }) {
  // File/PDF fields are only ever required on create — on edit, leaving the
  // input empty means "keep the current file", which is valid.
  const isFileType = field.type === "file" || field.type === "pdf";
  const required = isFileType ? field.required && !isEditing : field.required;

  if (field.type === "combobox") {
    const listId = `${field.name}-options`;
    return (
      <>
        <input
          type="text"
          list={listId}
          placeholder={field.label}
          {...register(field.name, { required })}
          className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
        />
        <datalist id={listId}>
          {(suggestions ?? []).map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        rows={field.rows ?? 3}
        placeholder={field.label}
        {...register(field.name, { required })}
        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        {...register(field.name, { required })}
        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
      >
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "file") {
    return (
      <input
        type="file"
        accept="image/*"
        {...register(field.name, { required })}
        className="w-full text-sm"
      />
    );
  }
  if (field.type === "pdf") {
    return (
      <input
        type="file"
        accept="application/pdf"
        {...register(field.name, { required })}
        className="w-full text-sm"
      />
    );
  }
  if (field.type === "date") {
    return (
      <input
        type="date"
        {...register(field.name, { required })}
        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
      />
    );
  }
  return (
    <input
      type="text"
      placeholder={field.label}
      {...register(field.name, { required })}
      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-brand-orange-accent"
    />
  );
}

function EntityForm({ config, item, items, onDone, onCancel, onDelete }) {
  const [submitError, setSubmitError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: Object.fromEntries(
      config.fields
        .filter((f) => f.type !== "file" && f.type !== "pdf")
        .map((f) => [f.name, item?.[f.name] ?? (f.type === "select" ? f.options[0] : "")])
    ),
  });

  const suggestionsByField = useMemo(() => {
    const map = {};
    for (const field of config.fields) {
      if (field.type !== "combobox") continue;
      const fromItems = (items ?? []).map((it) => it[field.name]).filter(Boolean);
      map[field.name] = Array.from(new Set([...(field.options ?? []), ...fromItems])).sort();
    }
    return map;
  }, [config.fields, items]);

  const onSubmit = async (values) => {
    setSubmitError("");
    const fd = buildFormData(config.fields, values);
    // Large uploads (a whole Saptahik PDF) can take a while on a slow
    // connection, so show how far along they are.
    const requestConfig = {
      onUploadProgress: (e) => e.total && setUploadProgress(Math.round((e.loaded * 100) / e.total)),
    };
    try {
      await config.beforeSubmit?.(fd, item);
      if (item) {
        await api.put(`${config.endpoint}/${item.id}`, fd, requestConfig);
      } else {
        await api.post(config.endpoint, fd, requestConfig);
      }
      onDone();
    } catch (err) {
      setSubmitError(extractErrorMessage(err));
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-light-green-tint bg-white p-5 sm:grid-cols-2"
    >
      {submitError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">{submitError}</p>
      )}
      {config.fields.map((field) => (
        <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
          <label className="mb-1 block text-xs font-semibold text-secondary-text">
            {field.label}
            {field.required && " *"}
          </label>
          <FieldInput field={field} register={register} isEditing={Boolean(item)} suggestions={suggestionsByField[field.name]} />
          {errors[field.name] && <p className="mt-1 text-xs text-red-600">Required</p>}
          {field.hint && <p className="mt-1 text-xs text-secondary-text">{field.hint}</p>}
          {(field.type === "file" || field.type === "pdf") && field.urlField && item?.[field.urlField] && (
            <p className="mt-1 text-xs text-secondary-text">Leave empty to keep the current file.</p>
          )}
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand-orange-accent px-5 py-2 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white disabled:opacity-60"
          >
            {isSubmitting
              ? uploadProgress !== null && uploadProgress < 100
                ? `Uploading… ${uploadProgress}%`
                : "Saving…"
              : item
                ? "Save Changes"
                : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#E2E8F0] px-5 py-2 text-sm font-semibold text-secondary-text hover:bg-light-green-tint/60"
          >
            Cancel
          </button>
        </div>
        {item && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={15} /> Delete Item (काढून टाका)
          </button>
        )}
      </div>
    </form>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-block rounded-full bg-light-green-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green-primary">
      {children}
    </span>
  );
}

function CellValue({ column, item }) {
  if (column.render) return column.render(item) || "—";
  if (column.image) {
    return item[column.key] ? (
      <img src={item[column.key]} alt="" className="h-10 w-10 rounded object-cover" />
    ) : (
      "—"
    );
  }
  if (column.badge) return item[column.key] ? <Badge>{String(item[column.key])}</Badge> : "—";
  if (column.link) {
    return item[column.key] ? (
      <a
        href={item[column.key]}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-brand-orange-accent hover:underline"
      >
        {column.link}
      </a>
    ) : (
      "—"
    );
  }
  return String(item[column.key] ?? "");
}

function EntityTable({ config, items, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-light-green-tint bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-light-green-tint/50 text-xs uppercase text-secondary-text">
          <tr>
            {config.columns.map((c) => (
              <th key={c.key} className="px-4 py-3">
                {c.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-green-tint/60">
          {items.map((item) => (
            <tr key={item.id}>
              {config.columns.map((c) => (
                <td key={c.key} className="max-w-xs truncate px-4 py-3">
                  <CellValue column={c} item={item} />
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-green-primary hover:bg-light-green-tint"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={config.columns.length + 1} className="px-4 py-8 text-center text-secondary-text">
                Nothing here yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function EntityGrid({ config, items, onEdit, onDelete }) {
  const imageColumn = config.columns.find((c) => c.image);
  const textColumns = config.columns.filter((c) => !c.image);

  if (items.length === 0) {
    return <p className="rounded-xl border border-light-green-tint bg-white py-10 text-center text-secondary-text">Nothing here yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group overflow-hidden rounded-xl border border-light-green-tint bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
        >
          <div className={`relative ${config.gridImageClass ?? "aspect-square"} w-full overflow-hidden bg-light-green-tint/40`}>
            {imageColumn && item[imageColumn.key] ? (
              <img
                src={item[imageColumn.key]}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-secondary-text">No image</div>
            )}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                title="Edit item"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-brand-green-primary shadow hover:bg-light-green-tint"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                title="Delete item"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="space-y-1 p-3">
            {textColumns.map((c, i) => (
              <p
                key={c.key}
                className={i === 0 ? "truncate text-sm font-semibold text-main-text" : "truncate text-xs text-secondary-text"}
              >
                <CellValue column={c} item={item} />
              </p>
            ))}
            <div className="mt-2.5 flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-brand-green-primary hover:bg-light-green-tint"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EntityManager({ config }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const load = () => {
    api
      .get(config.endpoint)
      .then((res) => setItems(res.data))
      .catch(() => setError(true));
  };

  useEffect(load, [config.endpoint]);

  const distinctCategories = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((it) => it.category).filter(Boolean))).sort();
  }, [items]);

  const displayedItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleEn = (item.titleEn || item.name || item.slug || "").toLowerCase();
      const titleMr = (item.titleMr || item.roleMr || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const date = item.issueDate || "";
      return titleEn.includes(q) || titleMr.includes(q) || cat.includes(q) || date.includes(q);
    });
  }, [items, categoryFilter, searchQuery]);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (id) => {
    setDeleteError("");
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await api.delete(`${config.endpoint}/${confirmDeleteId}`);
      const deletedId = confirmDeleteId;
      setConfirmDeleteId(null);
      if (editing?.id === deletedId) {
        closeForm();
      } else {
        load();
      }
    } catch (err) {
      setDeleteError(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-green-primary">{config.title}</h1>
          {items && (
            <p className="mt-0.5 text-xs text-secondary-text">
              Total {items.length} records {displayedItems.length !== items.length && `(showing ${displayedItems.length})`}
            </p>
          )}
        </div>
        {!formOpen && !config.hideAddNew && (
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-brand-green-primary px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-brand-green-medium"
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {formOpen && (
        <EntityForm
          key={editing?.id ?? "new"}
          config={config}
          item={editing}
          items={items ?? []}
          onDone={closeForm}
          onCancel={closeForm}
          onDelete={requestDelete}
        />
      )}

      {/* Kept mounted while the edit form is open so a running upload isn't lost. */}
      {config.Toolbar && <config.Toolbar items={items ?? []} onUploaded={load} />}

      {/* Filter and Search Bar */}
      {items && items.length > 0 && !formOpen && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-light-green-tint bg-white p-3 shadow-2xs">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, name or category..."
              className="w-full rounded-lg border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-brand-green-medium focus:ring-1 focus:ring-brand-green-medium"
            />
          </div>

          {distinctCategories.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-secondary-text" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-main-text outline-none focus:border-brand-green-medium"
              >
                <option value="all">All Albums / Categories ({items.length})</option>
                {distinctCategories.map((cat) => {
                  const count = items.filter((it) => it.category === cat).length;
                  return (
                    <option key={cat} value={cat}>
                      {cat} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">Could not load {config.title.toLowerCase()}.</p>}
      {deleteError && !confirmDeleteId && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{deleteError}</p>}
      {!error && !items && <p className="text-sm text-secondary-text">Loading…</p>}

      {items && config.layout === "grid" && (
        <EntityGrid config={config} items={displayedItems} onEdit={handleEdit} onDelete={requestDelete} />
      )}
      {items && config.layout !== "grid" && (
        <EntityTable config={config} items={displayedItems} onEdit={handleEdit} onDelete={requestDelete} />
      )}

      {/* Confirmation Modal for Delete */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete {config.title}?</h3>
                <p className="text-xs text-secondary-text">ही नोंद कायमची काढून टाकायची आहे का?</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-secondary-text">
              Are you sure you want to delete this record? This action cannot be undone and will permanently remove this item and its associated files.
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-semibold text-red-600">{deleteError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setConfirmDeleteId(null);
                  setDeleteError("");
                }}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel (रद्द करा)
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={16} /> Delete (काढून टाका)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
