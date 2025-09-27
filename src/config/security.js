import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const applySecurity = (app) => {
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'","cdn.jsdelivr.net","code.jquery.com","cdnjs.cloudflare.com","cdn.jsdelivr.net/npm/sweetalert2@11","cdn.jsdelivr.net/npm/chart.js"],
        "style-src": ["'self'","'unsafe-inline'","cdn.jsdelivr.net","cdnjs.cloudflare.com"],
        "img-src": ["'self'","data:"],
        "connect-src": ["'self'"]
      }
    }
  }));

  const origins = (process.env.CORS_ORIGINS||"").split(",").map(s=>s.trim()).filter(Boolean);
  app.use(cors({ origin: origins.length? origins : true }));

  app.use("/api/", rateLimit({ windowMs: 60*1000, max: 200 }));
  app.use("/api/auth/login", rateLimit({ windowMs: 5*60*1000, max: 10 }));
};
