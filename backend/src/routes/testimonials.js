import { body } from "express-validator";
import { Testimonial } from "../models/Testimonial.js";
import { createCrudRouter, toInt } from "./crudFactory.js";
import { createUpload, publicUrl } from "../middleware/upload.js";

const upload = createUpload("testimonials");

export const testimonialsRouter = createCrudRouter(Testimonial, {
  orderBy: ["sortOrder", "ASC"],
  fileFields: ["photoUrl"],
  uploadMiddleware: [upload.single("image")],
  validators: [
    body("name").isString().trim().notEmpty(),
    body("messageEn").isString().trim().notEmpty(),
    body("messageMr").isString().trim().notEmpty(),
    body("roleEn").optional({ values: "falsy" }).isString().trim(),
    body("roleMr").optional({ values: "falsy" }).isString().trim(),
  ],
  toPayload: (req, existing) => ({
    name: req.body.name,
    roleEn: req.body.roleEn,
    roleMr: req.body.roleMr,
    messageEn: req.body.messageEn,
    messageMr: req.body.messageMr,
    sortOrder: toInt(req.body.sortOrder, existing?.sortOrder ?? 0),
    photoUrl: publicUrl(req.file) ?? existing?.photoUrl,
  }),
});
