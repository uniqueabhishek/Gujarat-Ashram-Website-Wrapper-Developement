import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting About Content seed...");

  // Clear existing about content
  await prisma.aboutContent.deleteMany();
  console.log("Cleared existing about content");

  // Seed with current hardcoded data from MainSite.tsx
  const aboutContent = {
    // Hero Section (Top of page)
    heroTitle: "Art of Living",
    heroSubtitle: "Gujarat Ashram",
    heroDescription: "Discover a sanctuary for inner peace, ancient wisdom, and holistic rejuvenation amidst nature's embrace.",

    // About Section (Middle - "Why Visit")
    aboutBadge: "Discover",
    aboutTitle: "Why Visit the Gujarat Ashram?",
    aboutDescription: "Experience a calm environment filled with wisdom and transformative meditation practices. Our ashram offers programs that harmonize body, mind, and spirit through time-tested techniques.",
    videoUrl: "",

    // Footer Section
    footerTitle: "Gujarat Ashram",
    footerDescription: "A sanctuary for peace, meditation, and spiritual growth in the heart of Gujarat. Open to all, serving all.",
  };

  await prisma.aboutContent.create({ data: aboutContent });
  console.log("Created about content");

  console.log("\n✓ About content seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding about content:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
