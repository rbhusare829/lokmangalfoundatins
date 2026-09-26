import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CalendarPlus, CheckCircle2, FileText, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { api, extractErrorMessage } from "../lib/api.js";
import { renderPdfCover } from "../lib/pdf.js";
import { weekOfMonth } from "../lib/format.js";

// Must match the limit in backend/src/routes/saptahik.js.
const MAX_BYTES = 50 * 1024 * 1024;

const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5,
  jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
  जानेवारी: 1, फेब्रुवारी: 2, मार्च: 3, एप्रिल: 4, मे: 5, जून: 6, जुलै: 7, ऑगस्ट: 8,
  सप्टेंबर: 9, ऑक्टोबर: 10, नोव्हेंबर: 11, डिसेंबर: 12,
};

function toIso(y, m, d) {
  let year = Number(y);
  if (year < 100) year += 2000;
  const date = new Date(Date.UTC(year, Number(m) - 1, Number(d)));
  const valid =
    year >= 2000 && year <= 2100 && date.getUTCMonth() === Number(m) - 1 && date.getUTCDate() === Number(d);
  return valid ? date.toISOString().slice(0, 10) : "";
}

// Best-effort issue date from a file name, so a folder of weekly PDFs named
// by date doesn't need 70 dates typed in by hand. Understands 2025-01-05,
// 20250105, 05-01-2025 (day first), "5 Jan 2025", "Jan 5 2025",
// "५ जानेवारी २०२५" and "January 2025 week 2". Anything else is left empty
// for the admin to fill in.
export function dateFromFilename(name) {
  const s = name
    .replace(/\.pdf$/i, "")
    .replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)))
    .toLowerCase();
  const word = "([a-z\\u0900-\\u097f]+)";
  let m;
  if ((m = s.match(/(20\d{2})[-_. ](\d{1,2})[-_. ](\d{1,2})(?!\d)/))) return toIso(m[1], m[2], m[3]);
  if ((m = s.match(/(?<!\d)(20\d{2})(\d{2})(\d{2})(?!\d)/))) return toIso(m[1], m[2], m[3]);
  if ((m = s.match(/(?<!\d)(\d{1,2})[-_. ](\d{1,2})[-_. ](20\d{2}|\d{2})(?!\d)/))) return toIso(m[3], m[2], m[1]);
  m = s.match(new RegExp(`(?<!\\d)(\\d{1,2})(?:st|nd|rd|th)?[-_. ,]*${word}[-_. ,]*(20\\d{2})`));
  if (m && MONTHS[m[2]]) return toIso(m[3], MONTHS[m[2]], m[1]);
  m = s.match(new RegExp(`${word}[-_. ,]*(\\d{1,2})(?:st|nd|rd|th)?[-_. ,]+(20\\d{2})`));
  if (m && MONTHS[m[1]]) return toIso(m[3], MONTHS[m[1]], m[2]);
  const monthYear = s.match(new RegExp(`${word}[-_. ,]*(20\\d{2})`));
  const week = s.match(/(?:week|wk|आठवडा)[-_. ]*([1-5])/);
  if (monthYear && MONTHS[monthYear[1]] && week) return toIso(monthYear[2], MONTHS[monthYear[1]], (week[1] - 1) * 7 + 1);
  return "";
}

function addDays(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const inputClass =
  "w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:border-brand-orange-accent disabled:bg-gray-50";

function RowStatus({ row }) {
  if (row.status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
        <CheckCircle2 size={15} /> पूर्ण
      </span>
    );
  }
  if (row.status === "error") {
    return (
      <span className="inline-flex items-start gap-1 text-xs font-semibold text-red-600">
        <AlertCircle size={15} className="mt-px shrink-0" /> {row.error}
      </span>
    );
  }
  if (row.status === "cover") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-text">
        <Loader2 size={14} className="animate-spin" /> Cover…
      </span>
    );
  }
  if (row.status === "uploading") {
    return (
      <div>
        <div className="flex justify-between text-xs font-bold text-brand-green-primary">
          <span>अपलोड</span>
          <span>{row.progress}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-light-green-tint">
          <div className="h-full rounded-full bg-brand-orange-accent transition-all" style={{ width: `${row.progress}%` }} />
        </div>
      </div>
    );
  }
  return <span className="text-xs text-secondary-text">तयार</span>;
}

// Bulk uploader for the Saptahik admin page: pick or drop any number of
// PDFs, check each one's date, and upload them one after another with
// per-file and overall progress. Only the date is required per issue.
export default function SaptahikUploader({ items, onUploaded }) {
  const [rows, setRows] = useState([]);
  const [running, setRunning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const nextId = useRef(0);

  const existingDates = useMemo(() => new Set(items.map((i) => i.issueDate)), [items]);

  const update = (id, patch) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addFiles = (fileList) => {
    const pdfs = [...fileList]
      .filter((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const tooBig = (f) => f.size > MAX_BYTES;
    setRows((prev) => [
      ...prev,
      ...pdfs.map((file) => ({
        id: ++nextId.current,
        file,
        date: dateFromFilename(file.name),
        issueNumber: "",
        titleMr: "",
        status: tooBig(file) ? "error" : "ready",
        progress: 0,
        error: tooBig(file) ? "५० MB पेक्षा मोठी फाईल" : "",
      })),
    ]);
  };

  // Rows that still need uploading (not done, not rejected for size).
  const pending = rows.filter((r) => r.status !== "done" && r.file.size <= MAX_BYTES);
  const missingDates = pending.filter((r) => !r.date).length;
  const doneCount = rows.filter((r) => r.status === "done").length;
  const queue = rows.filter((r) => r.file.size <= MAX_BYTES);
  const totalBytes = queue.reduce((sum, r) => sum + r.file.size, 0);
  const sentBytes = queue.reduce(
    (sum, r) =>
      sum + (r.status === "done" ? r.file.size : r.status === "uploading" ? (r.file.size * r.progress) / 100 : 0),
    0
  );
  const overall = totalBytes ? Math.round((sentBytes * 100) / totalBytes) : 0;

  useEffect(() => {
    if (!running) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [running]);

  // Fill each empty date with the previous row's date + 7 days.
  const fillWeekly = () => {
    setRows((prev) => {
      let last = "";
      return prev.map((r) => {
        if (r.date) {
          last = r.date;
          return r;
        }
        if (!last) return r;
        last = addDays(last, 7);
        return { ...r, date: last };
      });
    });
  };

  const uploadAll = async () => {
    setRunning(true);
    for (const row of pending) {
      update(row.id, { status: "cover", progress: 0, error: "" });
      const fd = new FormData();
      fd.append("issueDate", row.date);
      fd.append("issueNumber", row.issueNumber);
      fd.append("titleMr", row.titleMr);
      fd.append("document", row.file);
      try {
        const cover = await renderPdfCover(row.file);
        if (cover) fd.append("image", cover);
      } catch {
        // No cover; the site shows a placeholder for this issue.
      }
      update(row.id, { status: "uploading" });
      try {
        await api.post("/saptahik", fd, {
          onUploadProgress: (e) => e.total && update(row.id, { progress: Math.round((e.loaded * 100) / e.total) }),
        });
        update(row.id, { status: "done", progress: 100 });
      } catch (err) {
        update(row.id, { status: "error", error: extractErrorMessage(err) });
      }
    }
    setRunning(false);
    onUploaded();
  };

  const currentIndex = rows.findIndex((r) => r.status === "cover" || r.status === "uploading");

  return (
    <div className="mb-6 rounded-xl border border-light-green-tint bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!running) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragOver ? "border-brand-orange-accent bg-light-orange-tint/50" : "border-[#D5CEBF] bg-[#FAF8F5]"
        }`}
      >
        <UploadCloud size={40} className="text-brand-orange-accent" />
        <div>
          <p className="text-base font-extrabold text-brand-green-primary">साप्ताहिक PDF अपलोड करा</p>
          <p className="mt-1 text-sm text-secondary-text">
            PDF फाईल्स येथे ओढा (drag) किंवा बटण दाबून निवडा — एकावेळी अनेक PDF चालतील.
          </p>
          <p className="mt-0.5 text-xs text-secondary-text">
            फक्त <b>तारीख</b> आवश्यक · प्रत्येक PDF ५० MB पर्यंत · Cover PDF च्या पहिल्या पानावरून आपोआप
          </p>
        </div>
        <button
          type="button"
          disabled={running}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-6 py-2.5 text-sm font-bold text-orange-btn-text shadow-sm transition hover:bg-[#D97A14] hover:text-white disabled:opacity-50"
        >
          <FileText size={16} /> PDF निवडा (Choose PDFs)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {rows.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-main-text">
              {rows.length} PDF निवडल्या
              {missingDates > 0 && (
                <span className="ml-2 font-semibold text-red-600">· {missingDates} फाईल्सना तारीख द्या</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={running}
                onClick={fillWeekly}
                title="रिकाम्या तारखा: आधीच्या ओळीच्या तारखेपेक्षा ७ दिवस पुढे"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] px-3.5 py-1.5 text-xs font-bold text-brand-green-primary hover:bg-light-green-tint/60 disabled:opacity-50"
              >
                <CalendarPlus size={14} /> रिकाम्या तारखा दर आठवड्याने भरा
              </button>
              <button
                type="button"
                disabled={running}
                onClick={() => setRows((prev) => prev.filter((r) => r.status !== "done"))}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] px-3.5 py-1.5 text-xs font-bold text-secondary-text hover:bg-light-green-tint/60 disabled:opacity-50"
              >
                <Trash2 size={14} /> पूर्ण झालेल्या काढा
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-lg bg-light-green-tint/40 p-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="min-w-0 flex-1">
              {running || doneCount > 0 ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-brand-green-primary">
                    <span>
                      {running ? "अपलोड चालू आहे…" : "अपलोड झाले"} · {doneCount} / {queue.length} पूर्ण
                    </span>
                    <span className="text-lg text-brand-orange-accent">{overall}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-orange-accent to-[#f2a54a] transition-all duration-300"
                      style={{ width: `${overall}%` }}
                    />
                  </div>
                  {running && <p className="mt-2 text-xs text-secondary-text">अपलोड पूर्ण होईपर्यंत हे पान बंद करू नका.</p>}
                </>
              ) : (
                <p className="text-sm text-secondary-text">
                  प्रत्येक PDF ची तारीख तपासा, मग <b>सर्व अपलोड करा</b> दाबा.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={uploadAll}
              disabled={running || pending.length === 0 || missingDates > 0}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-green-primary px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-green-medium disabled:opacity-50"
            >
              {running ? <Loader2 size={17} className="animate-spin" /> : <UploadCloud size={17} />}
              {running ? `अपलोड होत आहे… ${overall}%` : `सर्व अपलोड करा (${pending.length})`}
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-light-green-tint">
            <div className="hidden grid-cols-[minmax(0,1.6fr)_150px_80px_90px_minmax(0,1.2fr)_150px_36px] gap-3 bg-light-green-tint/50 px-3 py-2 text-[11px] font-bold uppercase text-secondary-text md:grid">
              <span>PDF</span>
              <span>तारीख *</span>
              <span>आठवडा</span>
              <span>अंक क्र.</span>
              <span>शीर्षक (optional)</span>
              <span>Status</span>
              <span />
            </div>
            <ul className="max-h-[480px] divide-y divide-light-green-tint/70 overflow-y-auto">
              {rows.map((row, i) => {
                const locked = running || row.status === "done";
                const duplicate = row.date && existingDates.has(row.date) && row.status !== "done";
                return (
                  <li
                    key={row.id}
                    className={`grid grid-cols-1 gap-2 px-3 py-2.5 md:grid-cols-[minmax(0,1.6fr)_150px_80px_90px_minmax(0,1.2fr)_150px_36px] md:items-center md:gap-3 ${
                      i === currentIndex ? "bg-light-orange-tint/40" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-main-text" title={row.file.name}>
                        {row.file.name}
                      </p>
                      <p className="text-xs text-secondary-text">{formatSize(row.file.size)}</p>
                    </div>
                    <div>
                      <input
                        type="date"
                        value={row.date}
                        disabled={locked}
                        onChange={(e) => update(row.id, { date: e.target.value })}
                        className={`${inputClass} ${row.date ? "border-[#E2E8F0]" : "border-red-400 bg-red-50"}`}
                      />
                      {duplicate && <p className="mt-0.5 text-[11px] font-semibold text-amber-600">या तारखेचा अंक आधीच आहे</p>}
                    </div>
                    <span className="text-sm font-semibold text-brand-green-primary">
                      {row.date ? `आठवडा ${weekOfMonth(row.date)}` : "—"}
                    </span>
                    <input
                      type="text"
                      value={row.issueNumber}
                      disabled={locked}
                      placeholder="उदा. 12"
                      onChange={(e) => update(row.id, { issueNumber: e.target.value })}
                      className={`${inputClass} border-[#E2E8F0]`}
                    />
                    <input
                      type="text"
                      value={row.titleMr}
                      disabled={locked}
                      placeholder="शीर्षक"
                      onChange={(e) => update(row.id, { titleMr: e.target.value })}
                      className={`${inputClass} border-[#E2E8F0]`}
                    />
                    <RowStatus row={row} />
                    <button
                      type="button"
                      disabled={running}
                      onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                      aria-label="Remove"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-text hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    >
                      <X size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
