import express from "express";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { detectClient } from "../middlewares/clientInfo.js";
import * as Ctrl from "../controllers/streams.controller.js";
import { createSchema } from "../controllers/streams.controller.js";

const router=express.Router();
router.get("/", auth(["user","admin"]), Ctrl.list);
router.get("/:id", auth(["user","admin"]), Ctrl.detail);
router.post("/create", auth(["user","admin"]), detectClient, validate(createSchema.keys({ platform: createSchema.extract("platform").valid("facebook") })), Ctrl.create);
router.post("/:id/start", auth(["user","admin"]), Ctrl.start);
router.post("/:id/stop", auth(["user","admin"]), Ctrl.stop);
router.delete("/:id", auth("admin"), Ctrl.remove);
export default router;
