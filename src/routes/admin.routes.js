import express from "express";
import { auth } from "../middlewares/auth.js";
import { getSettings, updateSetting } from "../controllers/admin.controller.js";
import db from "../models/index.js";

const router = express.Router();

// ✅ Public: bisa diakses tanpa login
router.get("/settings/public", async (req, res) => {
  try {
    const settings = await db.Settings.findOne({ where: { id: 1 } });
    if (!settings) {
      return res.json({ ok: true, settings: { enable_captcha: false } });
    }
    res.json({ ok: true, settings });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Gagal load settings" });
  }
});

// ✅ Admin only
router.get("/settings", auth("admin"), getSettings);
router.post("/settings", auth("admin"), updateSetting);

export default router;
