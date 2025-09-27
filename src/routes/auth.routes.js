import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { checkRegisterAllowed, verifyCaptcha } from "../middlewares/policies.js";
const router = express.Router();
router.post("/register", checkRegisterAllowed, verifyCaptcha, register);
router.post("/login", verifyCaptcha, login);
export default router;
