import express from "express";
import { auth } from "../middlewares/auth.js";
import { updateUsername, updatePassword } from "../controllers/user.controller.js";
const router=express.Router();
router.post("/update-username", auth(["user","admin"]), updateUsername);
router.post("/update-password", auth(["user","admin"]), updatePassword);
export default router;
