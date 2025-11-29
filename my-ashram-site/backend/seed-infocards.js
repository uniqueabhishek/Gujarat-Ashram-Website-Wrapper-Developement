import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Info Cards seed...");

  // Clear existing cards
  await prisma.infoCard.deleteMany();
  console.log("Cleared existing info cards");

  // Seed with current hardcoded data from MainSite.tsx
  const cards = [
    {
      title: "Ashram Overview",
      description: "Spreading happiness through yoga, meditation, and seva in a pristine environment.",
      icon: "Home",
      order: 0,
      isActive: true
    },
    {
      title: "Activities & Programs",
      description: "Join Sudarshan Kriya, silence retreats, and community service projects.",
      icon: "Users",
      order: 1,
      isActive: true
    },
    {
      title: "Facilities",
      description: "Comfortable accommodation, sattvic dining, lush gardens, and meditation halls.",
      icon: "ImageIcon",
      order: 2,
      isActive: true
    }
  ];

  for (const card of cards) {
    await prisma.infoCard.create({ data: card });
    console.log(`Created card: ${card.title}`);
  }

  console.log("\n✓ Info cards seeded successfully!");
  console.log(`Total cards created: ${cards.length}`);
}

main()
  .catch((error) => {
    console.error("Error seeding info cards:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
