import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const applySecurity = (app) => {
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],

        // ✅ Script: jQuery, Bootstrap, SweetAlert2, Chart.js, reCAPTCHA
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",         // biar lib seperti Chart.js ga error
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://code.jquery.com",
          "https://www.gstatic.com",
          "https://www.google.com"
        ],

        // ✅ Style: Bootstrap, Google Fonts
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],

        // ✅ Fonts
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],

        // ✅ Images
        imgSrc: [
          "'self'",
          "data:",
          "https://www.gstatic.com",
          "https://www.google.com"
        ],

        // ✅ Iframe (reCAPTCHA)
        frameSrc: [
          "'self'",
          "https://www.google.com"
        ],

        // ✅ AJAX / fetch
        connectSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ]
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

  // Rate limit login khusus
  app.use("/api/auth/login", rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10
  }));
};
