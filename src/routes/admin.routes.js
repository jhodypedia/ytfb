import express from "express";
import { auth } from "../middlewares/auth.js";
import { getSettings, updateSetting } from "../controllers/admin.controller.js";
const router=express.Router();
router.get("/settings", auth("admin"), getSettings);
router.post("/settings", auth("admin"), updateSetting);
export default router;
