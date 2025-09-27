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

        // ✅ script (jQuery, SweetAlert2, Chart.js, reCAPTCHA)
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://code.jquery.com",
          "https://cdnjs.cloudflare.com",
          "https://www.gstatic.com",
          "https://www.google.com"
        ],

        // ✅ style (Bootstrap, Google Fonts)
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com"
        ],

        // ✅ fonts
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],

        // ✅ images
        imgSrc: [
          "'self'",
          "data:",
          "https://www.gstatic.com",
          "https://www.google.com"
        ],

        // ✅ iframe (reCAPTCHA)
        frameSrc: [
          "'self'",
          "https://www.google.com"
        ],

        // ✅ AJAX / Websocket
        connectSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.gstatic.com"
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

  // Rate limit login
  app.use("/api/auth/login", rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10
  }));
};
