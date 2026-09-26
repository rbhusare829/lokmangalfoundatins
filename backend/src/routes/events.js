import { body } from "express-validator";
import { Event } from "../models/Event.js";
import { createCrudRouter } from "./crudFactory.js";
import { createUpload, publicUrl } from "../middleware/upload.js";

const upload = createUpload("events");

export const eventsRouter = createCrudRouter(Event, {
  orderBy: ["id", "DESC"],
  fileFields: ["imageUrl", "documentUrl"],
  uploadMiddleware: [
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "document", maxCount: 1 },
    ]),
  ],
  validators: [
    body("titleEn").isString().trim().notEmpty(),
    body("titleMr").isString().trim().notEmpty(),
    body("descriptionEn").isString().trim().notEmpty(),
    body("descriptionMr").isString().trim().notEmpty(),
    body("eventDate").optional({ values: "falsy" }).isString().trim(),
  ],
  toPayload: (req, existing) => ({
    titleEn: req.body.titleEn,
    titleMr: req.body.titleMr,
    descriptionEn: req.body.descriptionEn,
    descriptionMr: req.body.descriptionMr,
    eventDate: req.body.eventDate,
    imageUrl: publicUrl(req.files?.image?.[0]) ?? existing?.imageUrl,
    documentUrl: publicUrl(req.files?.document?.[0]) ?? existing?.documentUrl,
  }),
});
