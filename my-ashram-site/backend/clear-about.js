import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.aboutContent.deleteMany();
  console.log("Cleared AboutContent table");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
