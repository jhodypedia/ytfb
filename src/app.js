import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import expressLayouts from "express-ejs-layouts";
import db from "./models/index.js";
import bcrypt from "bcrypt";

import { applySecurity } from "./config/security.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";
import facebookRoutes from "./routes/facebook.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
applySecurity(app);

// Static
app.use("/public", express.static(path.join(__dirname, "../public")));

// EJS + express-ejs-layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Pages (SSR) – tanpa auth gating untuk demo. Integrasikan JWT cookie/session jika perlu.
app.get("/", (req,res)=> res.redirect("/login"));
app.get("/login", (req,res)=> res.render("auth/login",{ layout:false, title:"Login" }));
app.get("/register", (req,res)=> res.render("auth/register",{ layout:false, title:"Register" }));

app.get("/dashboard", (req,res)=> res.render("dashboard/index", { title:"Dashboard", user:{ username:"User" } }));
app.get("/dashboard/youtube/new", (req,res)=> res.render("dashboard/youtube_new",{ title:"YouTube New", user:{ username:"User" } }));
app.get("/dashboard/youtube/history", (req,res)=> res.render("dashboard/youtube_history",{ title:"YouTube History", user:{ username:"User" } }));
app.get("/dashboard/facebook/new", (req,res)=> res.render("dashboard/facebook_new",{ title:"Facebook New", user:{ username:"User" } }));
app.get("/dashboard/facebook/history", (req,res)=> res.render("dashboard/facebook_history",{ title:"Facebook History", user:{ username:"User" } }));
app.get("/dashboard/profile", (req,res)=> res.render("dashboard/profile",{ title:"Profil", user:{ username:"User" } }));

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/facebook", facebookRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);

// DB init + optional seed admin
const PORT = process.env.PORT || 4000;
await db.sequelize.sync();

if (process.env.ADMIN_SEED === "true") {
  const exists = await db.User.findOne({ where:{ username: process.env.ADMIN_USERNAME } });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
    await db.User.create({ username: process.env.ADMIN_USERNAME || "admin", password: hash, role: "admin" });
    console.log("Seed admin created:", process.env.ADMIN_USERNAME);
  }
}

app.listen(PORT, ()=> console.log(`Server running on :${PORT}`));
