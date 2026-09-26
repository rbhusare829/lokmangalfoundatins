// pdf.js is large, so it's only downloaded when someone actually opens a
// Saptahik issue (or an admin uploads one). The legacy build is used for its
// polyfills: many readers are on older Android phones whose browsers lack
// the newest JS features the modern build assumes.
let pdfjsPromise;

export function loadPdfjs() {
  pdfjsPromise ??= Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ])
    .then(([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    })
    .catch((err) => {
      // Let a later attempt retry (e.g. after a flaky mobile connection).
      pdfjsPromise = undefined;
      throw err;
    });
  return pdfjsPromise;
}

// Fonts, wasm image decoders and ICC colour profiles that pdf.js fetches at
// runtime; vite.config.js serves (dev) or copies (build) them under /pdfjs/.
const ASSET_OPTIONS = {
  standardFontDataUrl: "/pdfjs/standard_fonts/",
  wasmUrl: "/pdfjs/wasm/",
  iccUrl: "/pdfjs/iccs/",
};

// Returns pdf.js's loading task; `await task.promise` for the document and
// `task.destroy()` to cancel/free it.
export async function openPdf(source) {
  const pdfjs = await loadPdfjs();
  return pdfjs.getDocument({ ...ASSET_OPTIONS, ...source });
}

// Renders page 1 of a PDF File to a JPEG File, used as the issue cover when
// the admin doesn't upload one.
export async function renderPdfCover(file, width = 900) {
  const task = await openPdf({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    await page.render({ canvas, viewport, background: "#ffffff" }).promise;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ? new File([blob], "cover.jpg", { type: "image/jpeg" }) : null;
  } finally {
    task.destroy();
  }
}
