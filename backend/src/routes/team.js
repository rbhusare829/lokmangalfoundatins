import { body } from "express-validator";
import { TeamMember, TEAM_CATEGORIES } from "../models/TeamMember.js";
import { createCrudRouter, toInt } from "./crudFactory.js";
import { createUpload, publicUrl } from "../middleware/upload.js";

const upload = createUpload("team");

export const teamRouter = createCrudRouter(TeamMember, {
  orderBy: ["sortOrder", "ASC"],
  fileFields: ["photoUrl"],
  uploadMiddleware: [upload.single("image")],
  validators: [
    body("name").isString().trim().notEmpty(),
    body("nameMr").optional().isString().trim(),
    body("roleEn").isString().trim().notEmpty(),
    body("roleMr").isString().trim().notEmpty(),
    body("category").optional().isIn(TEAM_CATEGORIES),
  ],
  toPayload: (req, existing) => ({
    name: req.body.name,
    nameMr: req.body.nameMr || null,
    roleEn: req.body.roleEn,
    roleMr: req.body.roleMr,
    category: req.body.category ?? existing?.category ?? "Member",
    sortOrder: toInt(req.body.sortOrder, existing?.sortOrder ?? 0),
    photoUrl: publicUrl(req.file) ?? existing?.photoUrl,
  }),
});
