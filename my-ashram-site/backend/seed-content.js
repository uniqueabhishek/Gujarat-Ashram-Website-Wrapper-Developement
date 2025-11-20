import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed menu items
  await prisma.menuItem.createMany({
    data: [
      { name: "Meditation Hall", url: "https://example.com", order: 0 },
      { name: "Programs", url: "https://example.com", order: 1 },
    ],
  });

  // Seed hero buttons
  await prisma.heroButton.createMany({
    data: [
      { name: "Visit Ashram", url: "https://example.com", variant: "default", order: 0 },
      { name: "Upcoming Programs", url: "https://example.com", variant: "outline", order: 1 },
      { name: "Contact", url: "https://example.com", variant: "ghost", order: 2 },
    ],
  });

  // Seed footer links
  await prisma.footerLink.createMany({
    data: [
      { label: "Call", url: "tel:+910000000000", order: 0 },
      { label: "WhatsApp", url: "https://wa.me/910000000000", order: 1 },
      { label: "Email", url: "mailto:info@example.com", order: 2 },
      { label: "Map", url: "https://maps.google.com", order: 3 },
    ],
  });

  console.log("✅ Content seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
