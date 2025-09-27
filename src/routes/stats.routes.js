import express from "express";
import { auth } from "../middlewares/auth.js";
import { userStats } from "../controllers/stats.controller.js";
const router=express.Router();
router.get("/user", auth(["user","admin"]), userStats);
export default router;
