import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./middleware/upload.js";
import { sequelize } from "./config/database.js";
import { GalleryImage } from "./models/GalleryImage.js";
import { Testimonial } from "./models/Testimonial.js";
import { TeamMember } from "./models/TeamMember.js";
import { Project } from "./models/Project.js";
import { Event } from "./models/Event.js";
import { Blog } from "./models/Blog.js";

// One-time migration: uploads everything currently in backend/uploads/ to the
// configured S3 bucket, then repoints every DB record's /uploads/<file>
// reference at its new S3 URL. Requires STORAGE_DRIVER=s3 and the AWS_*
// variables set in .env (see .env.example) -- run once, after switching
// STORAGE_DRIVER to s3, before any new uploads happen through the admin UI.
//
//   npm run migrate:s3

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

const FILE_FIELD_MODELS = [
  { Model: Project, fields: ["coverImageUrl"] },
  { Model: GalleryImage, fields: ["imageUrl"] },
  { Model: TeamMember, fields: ["photoUrl"] },
  { Model: Testimonial, fields: ["photoUrl"] },
  { Model: Event, fields: ["imageUrl", "documentUrl"] },
  { Model: Blog, fields: ["imageUrl"] },
];

async function run() {
  if (process.env.STORAGE_DRIVER !== "s3") {
    throw new Error("Set STORAGE_DRIVER=s3 (and the AWS_* variables) in .env before running this migration.");
  }
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;

  await sequelize.authenticate();

  // Files live in per-section subfolders (uploads/gallery/, uploads/team/,
  // ...) -- walk recursively and keep that relative path as the S3 key, so
  // the bucket stays organized the same way the local folder and the repo
  // are.
  function listFilesRecursive(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFilesRecursive(full);
      return [full];
    });
  }
  const absoluteFiles = listFilesRecursive(uploadsDir);
  console.log(`Found ${absoluteFiles.length} files in backend/uploads/. Uploading to s3://${bucket} ...`);

  const urlByFilename = {};
  for (const absolutePath of absoluteFiles) {
    const relativeKey = path.relative(uploadsDir, absolutePath).split(path.sep).join("/");
    const ext = path.extname(absolutePath).toLowerCase();
    const body = fs.readFileSync(absolutePath);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: relativeKey,
        Body: body,
        ContentType: CONTENT_TYPES[ext] || "application/octet-stream",
      })
    );
    urlByFilename[relativeKey] = `https://${bucket}.s3.${region}.amazonaws.com/${relativeKey}`;
    process.stdout.write(".");
  }
  console.log(`\nUploaded ${absoluteFiles.length} files.`);

  let updatedRows = 0;
  for (const { Model, fields } of FILE_FIELD_MODELS) {
    const rows = await Model.findAll();
    for (const row of rows) {
      let changed = false;
      for (const field of fields) {
        const value = row[field];
        if (typeof value === "string" && value.startsWith("/uploads/")) {
          const filename = value.replace("/uploads/", "");
          if (urlByFilename[filename]) {
            row[field] = urlByFilename[filename];
            changed = true;
          } else {
            console.warn(`  ! ${Model.name}#${row.id}.${field} points to missing file: ${filename}`);
          }
        }
      }
      if (changed) {
        await row.save();
        updatedRows++;
      }
    }
  }
  console.log(`Repointed ${updatedRows} database rows to their new S3 URLs.`);
  console.log("Done. Existing files in backend/uploads/ were left in place -- delete that folder once you've verified the site.");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
