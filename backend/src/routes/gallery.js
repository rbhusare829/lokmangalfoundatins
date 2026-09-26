import { body } from "express-validator";
import { GalleryImage } from "../models/GalleryImage.js";
import { createCrudRouter, toInt } from "./crudFactory.js";
import { createUpload, publicUrl } from "../middleware/upload.js";

const upload = createUpload("gallery");

export const galleryRouter = createCrudRouter(GalleryImage, {
  orderBy: ["sortOrder", "ASC"],
  fileFields: ["imageUrl"],
  uploadMiddleware: [upload.single("image")],
  validators: [
    body("category").isString().trim().notEmpty(),
    body("titleEn").isString().trim().notEmpty(),
    body("titleMr").isString().trim().notEmpty(),
  ],
  toPayload: (req, existing) => ({
    category: req.body.category,
    titleEn: req.body.titleEn,
    titleMr: req.body.titleMr,
    sortOrder: toInt(req.body.sortOrder, existing?.sortOrder ?? 0),
    imageUrl: publicUrl(req.file) ?? existing?.imageUrl,
  }),
});
