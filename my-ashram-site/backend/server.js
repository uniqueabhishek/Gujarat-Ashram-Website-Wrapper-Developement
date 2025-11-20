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
app.use(helmet());
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
  const { items } = req.body;

  // Delete all existing items
  await prisma.menuItem.deleteMany();

  // Create new items
  const created = await Promise.all(
    items.map((item, index) =>
      prisma.menuItem.create({
        data: {
          name: item.name,
          url: item.url,
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
  const { buttons } = req.body;

  await prisma.heroButton.deleteMany();

  const created = await Promise.all(
    buttons.map((btn, index) =>
      prisma.heroButton.create({
        data: {
          name: btn.name,
          url: btn.url,
          variant: btn.variant || "default",
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
  const { links } = req.body;

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
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { category, order } = req.body;

  const image = await prisma.siteImage.create({
    data: {
      category: category || "general",
      filename: req.file.filename,
      path: `/images/${req.file.filename}`,
      order: parseInt(order) || 0,
    },
  });

  res.json(image);
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
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
