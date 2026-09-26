import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// pdf.js (the Saptahik reader) fetches standard fonts, wasm image decoders
// and ICC colour profiles at runtime by URL rather than through imports, so
// serve those folders at /pdfjs/* in dev and copy them into the build.
const PDFJS_ROOT = fileURLToPath(new URL("./node_modules/pdfjs-dist", import.meta.url));
const PDFJS_ASSET_DIRS = ["standard_fonts", "wasm", "iccs"];
const PDFJS_MIME = { ".wasm": "application/wasm", ".js": "text/javascript" };

function pdfjsAssets() {
  return {
    name: "pdfjs-assets",
    configureServer(server) {
      server.middlewares.use("/pdfjs", (req, res, next) => {
        const relative = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
        const file = path.join(PDFJS_ROOT, relative);
        const allowed = PDFJS_ASSET_DIRS.includes(relative.split("/")[0]) && file.startsWith(PDFJS_ROOT);
        if (!allowed || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader("Content-Type", PDFJS_MIME[path.extname(file)] ?? "application/octet-stream");
        fs.createReadStream(file).pipe(res);
      });
    },
    generateBundle() {
      for (const dir of PDFJS_ASSET_DIRS) {
        for (const name of fs.readdirSync(path.join(PDFJS_ROOT, dir))) {
          this.emitFile({
            type: "asset",
            fileName: `pdfjs/${dir}/${name}`,
            source: fs.readFileSync(path.join(PDFJS_ROOT, dir, name)),
          });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pdfjsAssets()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
