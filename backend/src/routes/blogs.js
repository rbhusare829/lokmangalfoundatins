import { body } from "express-validator";
import { Blog } from "../models/Blog.js";
import { createCrudRouter } from "./crudFactory.js";
import { createUpload, publicUrl } from "../middleware/upload.js";

const upload = createUpload("blogs");

export const blogsRouter = createCrudRouter(Blog, {
  orderBy: ["createdAt", "DESC"],
  fileFields: ["imageUrl"],
  uploadMiddleware: [upload.single("image")],
  validators: [
    body("slug").isSlug(),
    body("titleEn").isString().trim().notEmpty(),
    body("titleMr").isString().trim().notEmpty(),
    body("excerptEn").isString().trim().notEmpty(),
    body("excerptMr").isString().trim().notEmpty(),
    body("contentEn").isString().trim().notEmpty(),
    body("contentMr").isString().trim().notEmpty(),
    body("publishedDate").optional({ values: "falsy" }).isString().trim(),
  ],
  toPayload: (req, existing) => ({
    slug: req.body.slug,
    titleEn: req.body.titleEn,
    titleMr: req.body.titleMr,
    excerptEn: req.body.excerptEn,
    excerptMr: req.body.excerptMr,
    contentEn: req.body.contentEn,
    contentMr: req.body.contentMr,
    publishedDate: req.body.publishedDate,
    imageUrl: publicUrl(req.file) ?? existing?.imageUrl,
  }),
});
