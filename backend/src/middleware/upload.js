import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

// STORAGE_DRIVER=s3 for production (durable, works across multiple app
// instances); unset/local for zero-setup development, matching the
// DB_DIALECT sqlite/mysql toggle in config/database.js.
const STORAGE_DRIVER = process.env.STORAGE_DRIVER === "s3" ? "s3" : "local";

export const s3Client =
  STORAGE_DRIVER === "s3"
    ? new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const DOC_FIELDS = new Set(["document"]);

function fileFilter(req, file, cb) {
  if (DOC_FIELDS.has(file.fieldname)) {
    if (file.mimetype === "application/pdf") return cb(null, true);
    return cb(new Error("Only PDF files are allowed for this field"));
  }
  if (IMAGE_TYPES.has(file.mimetype)) return cb(null, true);
  return cb(new Error("Only PNG, JPEG, WEBP, or GIF images are allowed"));
}

function generatedFilename(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
}

// Each content type gets its own subfolder (uploads/gallery, uploads/team,
// ...) so the repo -- and GitHub's file browser -- groups photos the same
// way the admin panel does, instead of one flat folder of hashes.
function makeStorage(section) {
  if (STORAGE_DRIVER === "s3") {
    return multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => cb(null, `${section}/${generatedFilename(file)}`),
    });
  }
  const dir = path.join(uploadsDir, section);
  return multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, generatedFilename(file)),
  });
}

export function createUpload(section, { maxFileSize = 5 * 1024 * 1024 } = {}) {
  return multer({
    storage: makeStorage(section),
    fileFilter,
    limits: { fileSize: maxFileSize },
  });
}

export function publicUrl(file) {
  if (!file) return undefined;
  // multer-s3 gives the uploaded object's full URL as `location`; local disk
  // storage only knows its destination dir + filename, so build the served
  // path from those (and normalize to forward slashes -- Windows path.join
  // produces backslashes, which aren't valid in a URL).
  if (STORAGE_DRIVER === "s3") return file.location;
  return `/uploads/${path.relative(uploadsDir, file.path).split(path.sep).join("/")}`;
}

// Deletes whatever multer just wrote for this request -- used when a later
// validator rejects the request, since multer runs (and, for S3, uploads)
// before express-validator's checks do.
export function deleteMulterFile(file) {
  if (!file) return;
  if (STORAGE_DRIVER === "s3") {
    if (file.key) {
      s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: file.key })).catch(() => {});
    }
    return;
  }
  if (file.path) fs.unlink(file.path, () => {});
}

// Deletes a previously-stored file by its saved URL (a DB record's
// imageUrl/coverImageUrl/etc.) -- used when a record's file is replaced or
// the record itself is deleted. Only ever deletes files we generated
// ourselves; the seed-* prefix marks shared seed assets that multiple
// records may reference, so those are left alone rather than deleted out
// from under other records.
export function deleteUploadedFile(url) {
  if (!url) return;
  const filename = url.split("/").pop();
  if (!filename || filename.startsWith("seed-")) return;

  if (STORAGE_DRIVER === "s3") {
    if (!url.includes(`${process.env.AWS_S3_BUCKET}.s3.`)) return;
    // Key is everything after the bucket host, e.g. "gallery/167xxx.jpg".
    const key = url.split(/\.s3[.\w-]*\.amazonaws\.com\//).pop();
    s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key })).catch(() => {});
    return;
  }

  if (!url.startsWith("/uploads/")) return;
  // Strip the "/uploads/" prefix rather than just the basename, so files
  // inside a section subfolder (uploads/gallery/foo.jpg) resolve correctly.
  const relativePath = url.slice("/uploads/".length);
  fs.unlink(path.join(uploadsDir, ...relativePath.split("/")), () => {});
}
