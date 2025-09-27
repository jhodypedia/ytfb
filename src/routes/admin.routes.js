import express from "express";
import { auth } from "../middlewares/auth.js";
import { getSettings, updateSetting, publicSettings } from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Public (tanpa auth) → untuk login/register
router.get("/settings/public", publicSettings);

// ✅ Admin only
router.get("/settings", auth("admin"), getSettings);
router.post("/settings", auth("admin"), updateSetting);

export default router;
