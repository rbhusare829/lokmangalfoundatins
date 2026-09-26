import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Hand,
  Loader2,
  Minus,
  Plus,
  Share2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext.jsx";
import { useSiteContent } from "../../lib/SiteContentContext.jsx";
import { openPdf } from "../../lib/pdf.js";
import { playPageTurn } from "../../lib/pageTurnSound.js";
import { formatDate, localNumber, weekOfMonth } from "../../lib/format.js";

const ZOOM_LEVELS = [1, 1.5, 2, 3];
// Rendered canvases are cached so turning back and forth (and the pages
// prefetched ahead of the reader) show instantly; each one is several MB,
// so only the most recent few are kept.
const CACHE_SIZE = 8;
// Mobile Safari refuses canvases much above ~16M pixels.
const MAX_CANVAS_PIXELS = 8_000_000;

function createPageRenderer(pdf) {
  const cache = new Map();
  return function renderPage(number, pixelWidth) {
    const key = `${number}@${pixelWidth}`;
    const hit = cache.get(key);
    if (hit) {
      cache.delete(key);
      cache.set(key, hit);
      return hit;
    }
    const promise = pdf.getPage(number).then(async (page) => {
      const viewport = page.getViewport({ scale: pixelWidth / page.getViewport({ scale: 1 }).width });
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      await page.render({ canvas, viewport, background: "#ffffff" }).promise;
      return canvas;
    });
    promise.catch(() => cache.delete(key));
    cache.set(key, promise);
    while (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value);
    return promise;
  };
}

// Device pixels to render a page at, rounded up so small resizes reuse the
// cached render instead of re-rendering.
function pixelWidthFor(cssWidth, ratio) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const maxWidth = Math.sqrt(MAX_CANVAS_PIXELS * ratio);
  return Math.min(Math.ceil((cssWidth * dpr) / 64) * 64, Math.floor(maxWidth));
}

// Like a printed magazine: the cover stands alone, then pages pair up as
// 2–3, 4–5, … when there's room for a two-page spread.
function buildViews(numPages, spread) {
  if (!spread) return Array.from({ length: numPages }, (_, i) => [i + 1]);
  const views = [[1]];
  for (let p = 2; p <= numPages; p += 2) views.push(p + 1 <= numPages ? [p, p + 1] : [p]);
  return views;
}

function PdfPage({ renderPage, number, width, height, ratio }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const pixelWidth = pixelWidthFor(width, ratio);

  useEffect(() => {
    let cancelled = false;
    renderPage(number, pixelWidth)
      .then((source) => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        canvas.width = source.width;
        canvas.height = source.height;
        canvas.getContext("2d").drawImage(source, 0, 0);
        setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [renderPage, number, pixelWidth]);

  return (
    <div className="relative shrink-0 bg-white" style={{ width, height }}>
      <canvas ref={canvasRef} className="block h-full w-full object-contain" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-brand-green-primary/40" />
        </div>
      )}
    </div>
  );
}

const pageTurn = {
  enter: (dir) => ({ opacity: 0, rotateY: dir > 0 ? 28 : -28, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, rotateY: 0, x: 0 },
  exit: (dir) => ({ opacity: 0, rotateY: dir > 0 ? -28 : 28, x: dir > 0 ? -50 : 50 }),
};

// The pages follow the finger (or mouse) sideways, tilting like a page
// being lifted; letting go far or fast enough turns the page, otherwise
// they spring back. Off while zoomed, so dragging pans the zoomed page.
function DraggableSpread({ enabled, onSwipe, children }) {
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-400, 0, 400], [22, 0, -22]);
  return (
    <motion.div
      drag={enabled ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const power = info.offset.x + info.velocity.x * 0.25;
        if (power < -90) onSwipe(1);
        else if (power > 90) onSwipe(-1);
      }}
      style={{ x, rotateY, touchAction: enabled ? "pan-y pinch-zoom" : "auto" }}
      className={`relative flex select-none ${enabled ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      {children}
    </motion.div>
  );
}

// Per-viewer preferences; storage can be unavailable (private mode), so
// every access is guarded and falls back to the default.
function readPref(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "1";
  } catch {
    return fallback;
  }
}

function writePref(key, value) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // ignore
  }
}

const iconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-brand-green-primary disabled:pointer-events-none disabled:opacity-30";

export default function IssueReader({ issue, onClose }) {
  const { t, lang } = useLanguage();
  const r = t.saptahikReader;
  const num = (n) => localNumber(n, lang);
  const publicationTitle = useSiteContent("saptahik")?.title ?? t.pages.saptahik.title;
  const title = (lang === "en" && issue.titleEn) || issue.titleMr || publicationTitle;

  const [soundOn, setSoundOn] = useState(() => readPref("saptahik-sound", true));
  // Phones get a one-time hint that the page can be swiped.
  const [showHint, setShowHint] = useState(
    () => window.matchMedia("(pointer: coarse)").matches && !readPref("saptahik-swipe-hint-seen", false)
  );
  const [status, setStatus] = useState("loading");
  const [pdf, setPdf] = useState(null);
  const [ratio, setRatio] = useState(0.707);
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [stage, setStage] = useState(null);
  const [copied, setCopied] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    let task;
    let cancelled = false;
    setStatus("loading");
    setPdf(null);
    setPage(1);
    openPdf({ url: issue.pdfUrl })
      .then((loadingTask) => {
        task = loadingTask;
        if (cancelled) {
          loadingTask.destroy();
          return null;
        }
        return loadingTask.promise;
      })
      .then(async (doc) => {
        if (!doc || cancelled) return;
        const first = (await doc.getPage(1)).getViewport({ scale: 1 });
        if (cancelled) return;
        setRatio(first.width / first.height);
        setPdf(doc);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      task?.destroy();
    };
  }, [issue.pdfUrl]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStage({ w: Math.floor(width), h: Math.floor(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderPage = useMemo(() => (pdf ? createPageRenderer(pdf) : null), [pdf]);
  const numPages = pdf?.numPages ?? 0;
  const spread = Boolean(stage && stage.w >= 900 && stage.w / stage.h >= ratio * 1.6);
  const views = useMemo(() => buildViews(numPages, spread), [numPages, spread]);
  const viewIndex = Math.max(
    0,
    views.findIndex((v) => v.includes(page))
  );
  const view = views[viewIndex] ?? [];

  // Every page is sized for a full spread so the lone cover isn't bigger
  // than the pages after it.
  const fitHeight = stage ? Math.min(stage.h, stage.w / ((spread ? 2 : 1) * ratio)) : 0;
  const pageHeight = Math.floor(fitHeight * zoom);
  const pageWidth = Math.floor(pageHeight * ratio);

  const goTo = useCallback(
    (index) => {
      if (!views.length) return;
      const next = Math.min(Math.max(index, 0), views.length - 1);
      if (next === viewIndex) return;
      if (soundOn) playPageTurn();
      setDirection(next > viewIndex ? 1 : -1);
      setPage(views[next][0]);
      stageRef.current?.scrollTo({ top: 0, left: 0 });
      setShowHint(false);
    },
    [views, viewIndex, soundOn]
  );

  const toggleSound = () => {
    setSoundOn((on) => {
      writePref("saptahik-sound", !on);
      return !on;
    });
  };

  useEffect(() => {
    if (!showHint || status !== "ready") return undefined;
    writePref("saptahik-swipe-hint-seen", true);
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, [showHint, status]);

  const changeZoom = useCallback((dir) => {
    setZoom((z) => ZOOM_LEVELS[Math.min(Math.max(ZOOM_LEVELS.indexOf(z) + dir, 0), ZOOM_LEVELS.length - 1)]);
  }, []);

  // Warm the cache with the neighbouring spreads so page turns are instant.
  useEffect(() => {
    if (!renderPage || !pageWidth) return;
    const pixelWidth = pixelWidthFor(pageWidth, ratio);
    for (const i of [viewIndex + 1, viewIndex - 1]) {
      for (const n of views[i] ?? []) renderPage(n, pixelWidth).catch(() => {});
    }
  }, [renderPage, views, viewIndex, pageWidth, ratio]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(viewIndex + 1);
      if (e.key === "ArrowLeft") goTo(viewIndex - 1);
      if (e.key === "+" || e.key === "=") changeZoom(1);
      if (e.key === "-") changeZoom(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goTo, viewIndex, changeZoom]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // dismissed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; nothing useful to fall back to
    }
  };

  const pageLabel = view.length ? view.map(num).join("–") : num(1);
  const downloadName = `Lokmangal-Saptahik-${issue.issueDate}.pdf`;
  const navButton = `${iconButton} absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 sm:flex`;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex flex-col bg-[#0d2418]/95 backdrop-blur-sm"
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:gap-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-white sm:text-base">{title}</p>
          <p className="truncate text-xs text-white/60">
            {formatDate(issue.issueDate, lang)} · {r.week} {num(weekOfMonth(issue.issueDate))}
            {issue.issueNumber && ` · ${r.issue} ${num(issue.issueNumber)}`}
          </p>
        </div>
        {status === "ready" && (
          <div className="hidden items-center gap-1 rounded-full bg-white/5 p-1 sm:flex">
            <button type="button" onClick={() => changeZoom(-1)} disabled={zoom === ZOOM_LEVELS[0]} aria-label={r.zoomOut} className={`${iconButton} h-8 w-8`}>
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-xs font-bold text-white/80">{num(Math.round(zoom * 100))}%</span>
            <button type="button" onClick={() => changeZoom(1)} disabled={zoom === ZOOM_LEVELS.at(-1)} aria-label={r.zoomIn} className={`${iconButton} h-8 w-8`}>
              <Plus size={16} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={r.sound}
          aria-pressed={soundOn}
          title={r.sound}
          className={iconButton}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button type="button" onClick={share} aria-label={r.share} title={copied ? r.linkCopied : r.share} className={iconButton}>
          {copied ? <Check size={18} /> : <Share2 size={18} />}
        </button>
        <a href={issue.pdfUrl} download={downloadName} aria-label={r.download} title={r.download} className={iconButton}>
          <Download size={18} />
        </a>
        <button type="button" onClick={onClose} aria-label={r.close} className={`${iconButton} bg-white/20`}>
          <X size={20} />
        </button>
      </div>

      {/* Pages */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={stageRef}
          className={`absolute inset-3 flex sm:inset-x-20 sm:inset-y-5 ${zoom > 1 ? "overflow-auto" : "overflow-hidden"}`}
          style={{ perspective: 2000 }}
        >
          {status === "loading" && (
            <div className="m-auto flex flex-col items-center gap-3 text-white/70">
              <Loader2 size={34} className="animate-spin text-brand-orange-accent" />
              <p className="text-sm font-semibold">{r.loading}</p>
            </div>
          )}

          {status === "error" && (
            <div className="m-auto max-w-sm rounded-2xl bg-white/10 p-6 text-center text-white">
              <p className="text-sm leading-relaxed">{r.loadError}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <a
                  href={issue.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-5 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
                >
                  <ExternalLink size={16} /> {r.openPdf}
                </a>
                <a
                  href={issue.pdfUrl}
                  download={downloadName}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-5 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-brand-green-primary"
                >
                  <Download size={16} /> {r.download}
                </a>
              </div>
            </div>
          )}

          {status === "ready" && renderPage && pageWidth > 0 && (
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={view.join("-")}
                custom={direction}
                variants={pageTurn}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative m-auto"
              >
                <DraggableSpread enabled={zoom === 1 && views.length > 1} onSwipe={(dir) => goTo(viewIndex + dir)}>
                  <div className="relative flex shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                    {view.map((n) => (
                      <PdfPage key={n} renderPage={renderPage} number={n} width={pageWidth} height={pageHeight} ratio={ratio} />
                    ))}
                    {view.length === 2 && (
                      <span className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent" />
                    )}
                  </div>
                </DraggableSpread>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence>
          {showHint && status === "ready" && views.length > 1 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white shadow-lg"
            >
              <motion.span animate={{ x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                <Hand size={16} className="text-brand-orange-accent" />
              </motion.span>
              {r.swipeHint}
            </motion.p>
          )}
        </AnimatePresence>

        {status === "ready" && (
          <>
            <button type="button" onClick={() => goTo(viewIndex - 1)} disabled={viewIndex === 0} aria-label={r.prev} className={`${navButton} left-4`}>
              <ChevronLeft size={24} />
            </button>
            <button type="button" onClick={() => goTo(viewIndex + 1)} disabled={viewIndex >= views.length - 1} aria-label={r.next} className={`${navButton} right-4`}>
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Bottom bar */}
      {status === "ready" && (
        <div className="flex items-center gap-3 border-t border-white/10 px-3 py-2.5 sm:px-5">
          <button type="button" onClick={() => goTo(viewIndex - 1)} disabled={viewIndex === 0} aria-label={r.prev} className={`${iconButton} sm:hidden`}>
            <ChevronLeft size={20} />
          </button>
          <input
            type="range"
            min={0}
            max={Math.max(views.length - 1, 0)}
            value={viewIndex}
            onChange={(e) => goTo(Number(e.target.value))}
            aria-label={r.page}
            className="min-w-0 flex-1 accent-brand-orange-accent"
          />
          <span className="shrink-0 text-xs font-bold text-white/80 sm:text-sm">
            {r.page} {pageLabel} / {num(numPages)}
          </span>
          <button type="button" onClick={() => goTo(viewIndex + 1)} disabled={viewIndex >= views.length - 1} aria-label={r.next} className={`${iconButton} sm:hidden`}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
