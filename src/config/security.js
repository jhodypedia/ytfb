import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const applySecurity = (app) => {
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", "https:"],   // ✅ izinkan semua domain https
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        imgSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'self'", "https:"]
      }
    }
  }));

  // CORS
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  app.use(cors({
    origin: origins.length ? origins : true,
    credentials: true
  }));

  // Rate limit global
  app.use("/api/", rateLimit({
    windowMs: 60 * 1000,
    max: 200
  }));

  // Rate limit login
  app.use("/api/auth/login", rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10
  }));
};
