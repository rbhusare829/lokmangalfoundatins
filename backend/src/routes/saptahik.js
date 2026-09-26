import { body } from "express-validator";
import { SaptahikIssue } from "../models/SaptahikIssue.js";
import { createCrudRouter } from "./crudFactory.js";
import { createUpload, deleteMulterFile, publicUrl } from "../middleware/upload.js";

// A whole magazine issue is far bigger than the 5 MB photo limit.
const upload = createUpload("saptahik", { maxFileSize: 50 * 1024 * 1024 });

// crudFactory only enforces a required file for single-file resources; this
// one has a cover and a PDF, and only the PDF is mandatory. A cover sent
// without a PDF was already stored by multer, so drop it on rejection.
function requirePdfOnCreate(req, res, next) {
  if (req.method === "POST" && !req.files?.document?.[0]) {
    deleteMulterFile(req.files?.image?.[0]);
    return res.status(400).json({ error: "PDF is required" });
  }
  next();
}

export const saptahikRouter = createCrudRouter(SaptahikIssue, {
  orderBy: ["issueDate", "DESC"],
  fileFields: ["coverImageUrl", "pdfUrl"],
  uploadMiddleware: [
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "document", maxCount: 1 },
    ]),
  ],
  validators: [
    requirePdfOnCreate,
    body("titleMr").optional({ values: "falsy" }).isString().trim(),
    body("titleEn").optional({ values: "falsy" }).isString().trim(),
    body("issueNumber").optional({ values: "falsy" }).isString().trim(),
    body("issueDate").isISO8601({ strict: true }).withMessage("Issue date must be a valid date"),
  ],
  toPayload: (req, existing) => ({
    titleMr: req.body.titleMr || null,
    titleEn: req.body.titleEn || null,
    issueNumber: req.body.issueNumber || null,
    issueDate: req.body.issueDate,
    coverImageUrl: publicUrl(req.files?.image?.[0]) ?? existing?.coverImageUrl,
    pdfUrl: publicUrl(req.files?.document?.[0]) ?? existing?.pdfUrl,
  }),
});
