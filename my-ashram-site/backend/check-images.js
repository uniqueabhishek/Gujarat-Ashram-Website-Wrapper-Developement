import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkImages() {
  console.log("=== CHECKING SITEIMAGE TABLE ===\n");

  const images = await prisma.siteImage.findMany({
    orderBy: { id: 'asc' }
  });

  if (images.length === 0) {
    console.log("No images found in database.");
  } else {
    console.log(`Found ${images.length} images:\n`);
    images.forEach(img => {
      console.log(`ID: ${img.id}`);
      console.log(`  Filename: ${img.filename}`);
      console.log(`  Path: ${img.path}`);
      console.log(`  Category: ${img.category}`);
      console.log(`  Order: ${img.order}`);
      console.log("");
    });
  }

  await prisma.$disconnect();
}

checkImages().catch(console.error);
