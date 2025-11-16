import dotenv from "dotenv";
import bcrypt from "bcrypt";
import db from "./db.js";

dotenv.config();

const ADMIN_USER = process.env.SEED_ADMIN_USER || "admin";
const ADMIN_PASS = process.env.SEED_ADMIN_PASS || "";

if (!ADMIN_PASS) {
  console.error("Set SEED_ADMIN_PASS in .env before running seed");
  process.exit(1);
}

(async () => {
  const exists = db.prepare("SELECT 1 FROM admins WHERE username = ?").get(ADMIN_USER);
  if (exists) {
    console.log("Admin user already exists:", ADMIN_USER);
    process.exit(0);
  }
  const hash = await bcrypt.hash(ADMIN_PASS, 12);
  const info = db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run(ADMIN_USER, hash);
  console.log("Created admin id=", info.lastInsertRowid);
  process.exit(0);
})();
