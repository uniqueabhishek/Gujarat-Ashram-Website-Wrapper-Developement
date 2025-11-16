import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();

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

// rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many attempts, please slow down.",
});

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

// POST /api/auth/login
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

// POST /api/auth/logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ ok: true });
});

// GET /api/auth/me
app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid or expired token" });

  // Optionally check user exists
  const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
  if (!admin) return res.status(401).json({ error: "Invalid user" });

  return res.json({ ok: true, user: { id: admin.id, username: admin.username } });
});

// Protected example
app.get("/api/protected/status", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: "Not authenticated" });
  res.json({ ok: true, msg: "You are authenticated", user: payload });
});

// Register (optional — can be left for admin-only usage)
app.post("/api/auth/register", authLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const exists = await prisma.admin.findUnique({ where: { username } });
  if (exists) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 12);
  const created = await prisma.admin.create({ data: { username, passwordHash: hash } });
  return res.json({ ok: true, id: created.id });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
