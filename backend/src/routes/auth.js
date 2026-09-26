import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { AdminUser } from "../models/AdminUser.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

authRouter.post(
  "/login",
  loginLimiter,
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 1 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const { email, password } = req.body;
      const admin = await AdminUser.findOne({ where: { email } });
      if (!admin) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.cookie("token", token, COOKIE_OPTIONS);
      res.json({ id: admin.id, email: admin.email });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});
