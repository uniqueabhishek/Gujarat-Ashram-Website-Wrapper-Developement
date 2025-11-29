import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Events seed...");

  // Clear existing events
  await prisma.event.deleteMany();
  console.log("Cleared existing events");

  // Seed with current hardcoded data from MainSite.tsx
  const events = [
    {
      title: "Happiness Program — Weekend Batch",
      date: "Dec 5 - Dec 7, 2025",
      description: "A weekend immersion in breathing and mindfulness.",
      buttonText: "Register Now",
      buttonUrl: "",
      isActive: true
    },
    {
      title: "Sudarshan Kriya Workshop",
      date: "Jan 10, 2026",
      description: "Guided practice with certified instructors.",
      buttonText: "Register Now",
      buttonUrl: "",
      isActive: true
    },
    {
      title: "Silence Retreat",
      date: "Feb 14 - Feb 20, 2026",
      description: "Deep reflective retreat in nature.",
      buttonText: "Register Now",
      buttonUrl: "",
      isActive: true
    }
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
    console.log(`Created event: ${event.title}`);
  }

  console.log("\n✓ Events seeded successfully!");
  console.log(`Total events created: ${events.length}`);
}

main()
  .catch((error) => {
    console.error("Error seeding events:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
