import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authRouter } from "./routes/auth.js";
import { galleryRouter } from "./routes/gallery.js";
import { testimonialsRouter } from "./routes/testimonials.js";
import { teamRouter } from "./routes/team.js";
import { projectsRouter } from "./routes/projects.js";
import { eventsRouter } from "./routes/events.js";
import { blogsRouter } from "./routes/blogs.js";
import { saptahikRouter } from "./routes/saptahik.js";
import { contentRouter } from "./routes/content.js";
import { apiLimiter } from "./middleware/rateLimit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

// Only trust X-Forwarded-* headers when explicitly told to (i.e. we're
// actually behind a reverse proxy like Nginx). Trusting them unconditionally
// would let any client spoof its IP and dodge the login/API rate limiters.
// "0"/"false" are treated as disabled since that's the natural way an
// operator would try to turn this off, and a bare truthy-string check would
// otherwise leave it silently enabled.
const trustProxyEnv = (process.env.TRUST_PROXY || "").trim().toLowerCase();
if (trustProxyEnv && trustProxyEnv !== "0" && trustProxyEnv !== "false") {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Project pages embed YouTube videos via <iframe>; helmet's default
        // CSP has no frame-src, which falls back to default-src 'self' and
        // silently blocks them once the built frontend is served from this
        // same Express origin in production.
        frameSrc: ["'self'", "https://www.youtube.com"],
        // The Saptahik PDF reader (pdf.js) compiles WebAssembly decoders for
        // JPEG 2000 images and ICC colour profiles found in print PDFs.
        scriptSrc: ["'self'", "'wasm-unsafe-eval'"],
      },
    },
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", apiLimiter);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/team", teamRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/saptahik", saptahikRouter);
app.use("/api/content", contentRouter);

// Any /api/* path that didn't match a route above is an unknown endpoint —
// answer with JSON instead of falling through to Express's default HTML
// error page, so API consumers never have to handle two response formats.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Serve the built frontend in production (single-origin deployment)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "..", "frontend", "dist");
  app.use(express.static(distPath));
  app.get(/^(?!\/(?:api|uploads)).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("allowed")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeDatabaseError") {
    const message = err.errors?.map((e) => e.message).join("; ") || "Invalid data submitted.";
    return res.status(400).json({ error: message });
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "A record with that value already exists." });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
