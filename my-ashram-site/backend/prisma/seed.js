import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const user = process.env.SEED_ADMIN_USER || "admin";
  const pass = process.env.SEED_ADMIN_PASS || "";

  if (!pass) {
    console.error("Please set SEED_ADMIN_PASS in .env before running seed.");
    process.exit(1);
  }

  const exists = await prisma.admin.findUnique({ where: { username: user } });
  if (exists) {
    console.log("Admin already exists, UPDATING password...");
    const hash = await bcrypt.hash(pass, 12);
    await prisma.admin.update({
      where: { username: user },
      data: { passwordHash: hash }
    });
    console.log("Password updated to:", pass);
    return;
  }

  const hash = await bcrypt.hash(pass, 12);
  const created = await prisma.admin.create({
    data: { username: user, passwordHash: hash }
  });

  console.log("Created admin id=", created.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
