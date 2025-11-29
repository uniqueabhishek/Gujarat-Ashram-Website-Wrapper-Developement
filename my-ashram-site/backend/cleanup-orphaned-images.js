import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function cleanupOrphanedImages() {
  console.log("=== CLEANING UP ORPHANED IMAGES ===\n");

  const uploadsDir = path.join(__dirname, "../public/images");

  // Get all images from database
  const images = await prisma.siteImage.findMany();

  console.log(`Found ${images.length} images in database.\n`);

  let orphanedCount = 0;
  let deletedIds = [];

  for (const img of images) {
    const filePath = path.join(uploadsDir, img.filename);
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      console.log(`❌ ORPHANED: ${img.filename} (ID: ${img.id}) - File doesn't exist, removing from database...`);

      // Delete from database
      await prisma.siteImage.delete({
        where: { id: img.id }
      });

      orphanedCount++;
      deletedIds.push(img.id);
    } else {
      console.log(`✅ OK: ${img.filename} (ID: ${img.id})`);
    }
  }

  console.log(`\n=== CLEANUP COMPLETE ===`);
  console.log(`Total images checked: ${images.length}`);
  console.log(`Orphaned records removed: ${orphanedCount}`);
  if (deletedIds.length > 0) {
    console.log(`Deleted IDs: ${deletedIds.join(", ")}`);
  }

  await prisma.$disconnect();
}

cleanupOrphanedImages().catch(console.error);
