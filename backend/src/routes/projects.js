import { body } from "express-validator";
import { Project } from "../models/Project.js";
import { createCrudRouter, toInt } from "./crudFactory.js";
import { createUpload, publicUrl } from "../middleware/upload.js";

const upload = createUpload("projects");

export const projectsRouter = createCrudRouter(Project, {
  orderBy: ["sortOrder", "ASC"],
  fileFields: ["coverImageUrl"],
  uploadMiddleware: [upload.single("image")],
  validators: [
    body("slug").isSlug(),
    body("titleEn").isString().trim().notEmpty(),
    body("titleMr").isString().trim().notEmpty(),
    body("summaryEn").isString().trim().notEmpty(),
    body("summaryMr").isString().trim().notEmpty(),
    body("objectiveEn").optional({ values: "falsy" }).isString().trim(),
    body("objectiveMr").optional({ values: "falsy" }).isString().trim(),
    body("descriptionEn").optional({ values: "falsy" }).isString().trim(),
    body("descriptionMr").optional({ values: "falsy" }).isString().trim(),
    body("statEn").optional({ values: "falsy" }).isString().trim(),
    body("statMr").optional({ values: "falsy" }).isString().trim(),
    body("videoUrl").optional({ values: "falsy" }).isURL(),
  ],
  toPayload: (req, existing) => ({
    slug: req.body.slug,
    titleEn: req.body.titleEn,
    titleMr: req.body.titleMr,
    summaryEn: req.body.summaryEn,
    summaryMr: req.body.summaryMr,
    objectiveEn: req.body.objectiveEn,
    objectiveMr: req.body.objectiveMr,
    descriptionEn: req.body.descriptionEn,
    descriptionMr: req.body.descriptionMr,
    statEn: req.body.statEn,
    statMr: req.body.statMr,
    videoUrl: req.body.videoUrl,
    sortOrder: toInt(req.body.sortOrder, existing?.sortOrder ?? 0),
    coverImageUrl: publicUrl(req.file) ?? existing?.coverImageUrl,
  }),
});
