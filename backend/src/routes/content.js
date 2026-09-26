import { Router } from "express";
import { body, validationResult } from "express-validator";
import { PageContent } from "../models/PageContent.js";
import { requireAuth } from "../middleware/auth.js";

export const contentRouter = Router();

contentRouter.get("/", async (req, res, next) => {
  try {
    const rows = await PageContent.findAll();
    const map = {};
    for (const row of rows) {
      map[row.key] = { en: row.dataEn, mr: row.dataMr };
    }
    res.json(map);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/:key", async (req, res, next) => {
  try {
    const row = await PageContent.findOne({ where: { key: req.params.key } });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ en: row.dataEn, mr: row.dataMr });
  } catch (err) {
    next(err);
  }
});

contentRouter.put(
  "/:key",
  requireAuth,
  body("dataEn").isObject().withMessage("dataEn must be an object"),
  body("dataMr").isObject().withMessage("dataMr must be an object"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const [row] = await PageContent.findOrCreate({
        where: { key: req.params.key },
        defaults: { dataEn: req.body.dataEn, dataMr: req.body.dataMr },
      });
      await row.update({ dataEn: req.body.dataEn, dataMr: req.body.dataMr });
      res.json({ en: row.dataEn, mr: row.dataMr });
    } catch (err) {
      next(err);
    }
  }
);
