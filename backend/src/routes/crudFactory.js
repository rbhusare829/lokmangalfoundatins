import { Router } from "express";
import { validationResult } from "express-validator";
import { requireAuth } from "../middleware/auth.js";
import { deleteMulterFile, deleteUploadedFile } from "../middleware/upload.js";

// FormData always sends field values as strings, and a blank number input
// sends "" rather than omitting the field — so `req.body.sortOrder ?? 0`
// silently stores an empty string into an INTEGER column instead of falling
// back. This coerces to a real finite number, or the provided fallback.
export function toInt(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// multer writes uploaded files (to disk, or to S3 -- see middleware/upload.js)
// before express-validator's checks run, so a request with a valid image but
// an invalid text field (e.g. missing title) leaves that file stored forever
// with nothing in the DB pointing to it. Clean up whatever multer attached to
// this request when validation fails.
function deleteRequestFiles(req) {
  const files = req.file ? [req.file] : Object.values(req.files || {}).flat();
  for (const file of files) {
    deleteMulterFile(file);
  }
}

// multipart/form-data (which both the admin UI and any API client use to
// submit text alongside file uploads) normalizes bare "\n" line breaks to
// "\r\n" per the multipart encoding spec, regardless of what was actually
// typed into a textarea. Multi-paragraph fields are later split on "\n\n"
// for rendering (ProjectDetail, BlogDetail), which silently stops matching
// once every "\n\n" becomes "\r\n\r\n". Normalize back to bare "\n" here so
// stored text stays consistent no matter how it arrived.
function normalizeLineEndings(req, res, next) {
  for (const key of Object.keys(req.body || {})) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].replace(/\r\n/g, "\n");
    }
  }
  next();
}

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    deleteRequestFiles(req);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// For a resource with a single file field whose DB column is NOT NULL:
// reject a create request with no file instead of letting it reach Sequelize
// and come back as a raw "notNull Violation" error. Derived from the model's
// own allowNull metadata so a route can't drift out of sync with its schema
// the way team.js once did (photoUrl is nullable but was requiring an image).
function buildImageRequirement(Model, fileFields) {
  if (fileFields.length !== 1) return null;
  const attribute = Model.rawAttributes[fileFields[0]];
  if (!attribute || attribute.allowNull !== false) return null;
  return function requireImageOnCreate(req, res, next) {
    if (req.method === "POST" && !req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    next();
  };
}

export function createCrudRouter(
  Model,
  { uploadMiddleware = [], validators = [], toPayload = (req) => req.body, orderBy, fileFields = [] } = {}
) {
  const router = Router();
  const imageRequirement = buildImageRequirement(Model, fileFields);
  const effectiveValidators = imageRequirement ? [imageRequirement, ...validators] : validators;

  router.get("/", async (req, res, next) => {
    try {
      const items = await Model.findAll(orderBy ? { order: [orderBy] } : undefined);
      res.json(items);
    } catch (err) {
      next(err);
    }
  });

  router.post(
    "/",
    requireAuth,
    ...uploadMiddleware,
    normalizeLineEndings,
    ...effectiveValidators,
    handleValidation,
    async (req, res, next) => {
      try {
        const item = await Model.create(toPayload(req));
        res.status(201).json(item);
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    "/:id",
    requireAuth,
    ...uploadMiddleware,
    normalizeLineEndings,
    ...effectiveValidators,
    handleValidation,
    async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: "Not found" });
        const before = fileFields.map((field) => item[field]);
        await item.update(toPayload(req, item));
        fileFields.forEach((field, i) => {
          if (before[i] && before[i] !== item[field]) deleteUploadedFile(before[i]);
        });
        res.json(item);
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      fileFields.forEach((field) => deleteUploadedFile(item[field]));
      await item.destroy();
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
