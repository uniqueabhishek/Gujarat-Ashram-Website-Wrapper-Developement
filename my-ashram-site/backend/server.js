import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const COOKIE_NAME = process.env.COOKIE_NAME || "ashram_token";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

if (!JWT_SECRET) {
  console.error("JWT_SECRET missing in .env");
  process.exit(1);
}

const app = express();

// Configure helmet with relaxed CSP for images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "http://localhost:4000", "http://localhost:5173"],
    },
  },
}));

app.use(express.json());
app.use(cookieParser());

// CORS with credentials
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Serve uploaded images
const uploadsDir = path.join(__dirname, "../public/images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/images", express.static(uploadsDir));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many attempts, please slow down.",
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });
}

// Middleware to verify authentication
function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid or expired token" });

  req.user = payload;
  next();
}

// ============================================
// AUTH ROUTES
// ============================================

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return res.status(401).json({ error: "Invalid username or password" });

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid username or password" });

  const token = signToken({ id: admin.id, username: admin.username });
  setAuthCookie(res, token);

  return res.json({ ok: true, username: admin.username });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ ok: true });
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid or expired token" });

  const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
  if (!admin) return res.status(401).json({ error: "Invalid user" });

  return res.json({ ok: true, user: { id: admin.id, username: admin.username } });
});

// ============================================
// MENU ITEMS ROUTES
// ============================================

app.get("/api/menu-items", apiLimiter, async (req, res) => {
  const items = await prisma.menuItem.findMany({ orderBy: { order: "asc" } });
  res.json(items);
});

app.post("/api/menu-items", requireAuth, async (req, res) => {
  const items = req.body;

  // Delete all existing items
  await prisma.menuItem.deleteMany();

  // Create new items
  const created = await Promise.all(
    items.map((item, index) =>
      prisma.menuItem.create({
        data: {
          name: item.name,
          url: item.url,
          isSpecial: item.isSpecial || false,      // ✅ FIXED: Added isSpecial
          variant: item.variant || "default",      // ✅ FIXED: Added variant
          order: index,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// HERO BUTTONS ROUTES
// ============================================

app.get("/api/hero-buttons", apiLimiter, async (req, res) => {
  const buttons = await prisma.heroButton.findMany({ orderBy: { order: "asc" } });
  res.json(buttons);
});

app.post("/api/hero-buttons", requireAuth, async (req, res) => {
  const buttons = req.body;

  await prisma.heroButton.deleteMany();

  const created = await Promise.all(
    buttons.map((btn, index) =>
      prisma.heroButton.create({
        data: {
          name: btn.name,
          url: btn.url,
          variant: btn.variant || "default",    // ✅ FIXED: Changed 'item' to 'btn', removed isSpecial
          order: index,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// FOOTER LINKS ROUTES
// ============================================

app.get("/api/footer-links", apiLimiter, async (req, res) => {
  const links = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
  res.json(links);
});

app.post("/api/footer-links", requireAuth, async (req, res) => {
  const links = req.body;

  await prisma.footerLink.deleteMany();

  const created = await Promise.all(
    links.map((link, index) =>
      prisma.footerLink.create({
        data: {
          label: link.label,
          url: link.url,
          order: index,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// EVENTS ROUTES
// ============================================

app.get("/api/events", apiLimiter, async (req, res) => {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
  res.json(events);
});

app.post("/api/events", requireAuth, async (req, res) => {
  const events = req.body;

  await prisma.event.deleteMany();

  const created = await Promise.all(
    events.map((event) =>
      prisma.event.create({
        data: {
          title: event.title,
          date: event.date,
          description: event.description,
          buttonText: event.buttonText || "Register Now",
          buttonUrl: event.buttonUrl || "",
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// ABOUT ROUTES
// ============================================

app.get("/api/about", apiLimiter, async (req, res) => {
  const about = await prisma.aboutContent.findFirst();
  if (!about) {
    return res.json({
      id: "default",
      // Hero Section
      heroTitle: "Art of Living",
      heroSubtitle: "Gujarat Ashram",
      heroDescription: "Discover a sanctuary for inner peace, ancient wisdom, and holistic rejuvenation amidst nature's embrace.",
      // About Section
      aboutBadge: "Discover",
      aboutTitle: "Why Visit the Gujarat Ashram?",
      aboutDescription: "Experience a calm environment filled with wisdom and transformative meditation practices.",
      videoUrl: "",
      // Footer Section
      footerTitle: "Gujarat Ashram",
      footerDescription: "A sanctuary for peace, meditation, and spiritual growth in the heart of Gujarat. Open to all, serving all.",
    });
  }
  res.json(about);
});

app.post("/api/about", requireAuth, async (req, res) => {
    const content = req.body;

    // Delete existing about content
    await prisma.aboutContent.deleteMany();

    // Create new about content
    const created = await prisma.aboutContent.create({
      data: {
        // Hero Section
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroDescription: content.heroDescription,
        // About Section
        aboutBadge: content.aboutBadge || "",
        aboutTitle: content.aboutTitle,
        aboutDescription: content.aboutDescription,
        videoUrl: content.videoUrl || "",
        // Footer Section
        footerTitle: content.footerTitle,
        footerDescription: content.footerDescription,
      },
    });

    res.json(created);
  });

// ============================================
// INFO CARDS ROUTES
// ============================================

app.get("/api/info-cards", apiLimiter, async (req, res) => {
  const cards = await prisma.infoCard.findMany({ orderBy: { order: "asc" } });
  res.json(cards);
});

app.post("/api/info-cards", requireAuth, async (req, res) => {
  const cards = req.body;

  await prisma.infoCard.deleteMany();

  const created = await Promise.all(
    cards.map((card, index) =>
      prisma.infoCard.create({
        data: {
          title: card.title,
          description: card.description,
          icon: card.icon,
          order: index,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// CONTACT ROUTES
// ============================================

app.get("/api/contact", apiLimiter, async (req, res) => {
  const contacts = await prisma.contactInfo.findMany({ orderBy: { order: "asc" } });
  res.json(contacts);
});

app.post("/api/contact", requireAuth, async (req, res) => {
  const contacts = req.body;

  await prisma.contactInfo.deleteMany();

  const created = await Promise.all(
    contacts.map((contact, index) =>
      prisma.contactInfo.create({
        data: {
          type: contact.type,
          label: contact.label,
          value: contact.value,
          url: contact.url || "",
          order: index,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// IMAGE ROUTES
// ============================================

app.get("/api/images/:category", apiLimiter, async (req, res) => {
  const { category } = req.params;
  const images = await prisma.siteImage.findMany({
    where: { category },
    orderBy: { order: "asc" },
  });
  res.json(images);
});

app.post("/api/images/upload", requireAuth, upload.single("image"), async (req, res) => {
  console.log("Upload request received");
  console.log("File:", req.file);
  console.log("Body:", req.body);

  if (!req.file) {
    console.error("No file in request");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { category, order } = req.body;

  try {
    const image = await prisma.siteImage.create({
      data: {
        category: category || "general",
        filename: req.file.filename,
        path: `/images/${req.file.filename}`,
        order: parseInt(order) || 0,
      },
    });

    console.log("Image saved to database:", image);
    res.json(image);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save image to database" });
  }
});

app.delete("/api/images/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const image = await prisma.siteImage.findUnique({ where: { id: parseInt(id) } });
  if (!image) return res.status(404).json({ error: "Image not found" });

  // Delete file from filesystem
  const filePath = path.join(uploadsDir, image.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.siteImage.delete({ where: { id: parseInt(id) } });

  res.json({ ok: true });
});

app.post("/api/images/reorder", requireAuth, async (req, res) => {
  const { images } = req.body; // Array of { id, order }

  await Promise.all(
    images.map(({ id, order }) =>
      prisma.siteImage.update({
        where: { id },
        data: { order },
      })
    )
  );

  res.json({ ok: true });
});

// ============================================
// FOOTER SETTINGS ROUTES
// ============================================

app.get("/api/footer-settings", apiLimiter, async (req, res) => {
  const settings = await prisma.footerSettings.findFirst();
  res.json(settings);
});

app.post("/api/footer-settings", requireAuth, async (req, res) => {
  const { title, description } = req.body;

  // Delete existing and create new (single record table)
  await prisma.footerSettings.deleteMany();

  const settings = await prisma.footerSettings.create({
    data: {
      title,
      description,
    },
  });

  res.json(settings);
});

// ============================================
// SOCIAL LINKS ROUTES
// ============================================

app.get("/api/social-links", apiLimiter, async (req, res) => {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  res.json(links);
});

app.post("/api/social-links", requireAuth, async (req, res) => {
  const links = req.body;

  await prisma.socialLink.deleteMany();

  const created = await Promise.all(
    links.map((link, index) =>
      prisma.socialLink.create({
        data: {
          platform: link.platform,
          url: link.url,
          order: index,
          isActive: link.isActive !== false,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// FOOTER BUTTONS ROUTES
// ============================================

app.get("/api/footer-buttons", apiLimiter, async (req, res) => {
  const buttons = await prisma.footerButton.findMany({ orderBy: { order: "asc" } });
  res.json(buttons);
});

app.post("/api/footer-buttons", requireAuth, async (req, res) => {
  const buttons = req.body;

  await prisma.footerButton.deleteMany();

  const created = await Promise.all(
    buttons.map((button, index) =>
      prisma.footerButton.create({
        data: {
          label: button.label,
          url: button.url,
          order: index,
          isActive: button.isActive !== false,
        },
      })
    )
  );

  res.json(created);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
